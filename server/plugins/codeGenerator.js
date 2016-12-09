const attendance_code_length = 6;
var currentInterval = 0;
var codes = {};

exports.register = function (server, options, next) {

    // generates a new code randomly as a string with the given length
    // and sends a signal to all listening sockets the new code
    const generateCode = function (sequence_id) {
        var code = '';
        for(var i = 0; i < attendance_code_length; i++){
            code += Math.floor(Math.random() * 10);
        }
        return setCode(sequence_id, code);
    }

    const check = function (sequence_id, userEnteredCode, next) {
        //checks to make sure it exists in codes
        if(!codes[sequence_id])
            return next(true, false);
        //sends back whether it is a valid code or not
        return next(null, codes[sequence_id] == userEnteredCode);
    }

    const begin = function(sequence_id, next){
        return next(null, generateCode(sequence_id));
    }
    
    const getCode = function(){
        return codes;
    }

    const setCode = function(sequence_id, code){
        codes[sequence_id] = code;
        server.publish(`/sequence/${sequence_id}/code`, { sequence_id: sequence_id, code: code});
        return codes[sequence_id];
    }

    const end = function(sequence_id, next){
        if(!codes[sequence_id])
            return next(null, {success: false})
        else {
            delete codes[sequence_id]
            return next(null, {success: true});
        }
    }


    // sets the methods above as server methods so they can be accessed in other files
    server.method('attendance.classBegin', begin);
    server.method('attendance.classOver', end, {});
    server.method('attendance.checkCode', check, {});
    server.method('attendance.code', getCode, {callback: false});
    server.method('attendance.setCode', setCode, {callback: false});
    
    // must be a subscription to sequence because there could be multiple sections at the same time
    server.subscription('/sequence/{sequence_id}/code');

    // generates a new code for all the sequences in $codes every minute
    currentInterval = setInterval(() => {
        for(var i in codes){
            delete codes[i];
            generateCode(i);
        }
    }, 60 * 1000)

    next();
}

exports.attendance_code_length = attendance_code_length;
exports.register.attributes = { name: 'Attendance Code Generator', version: '0.0.2' };
