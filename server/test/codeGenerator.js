'use strict';

import { init_test, expect, server } from './support';
const lab = exports.lab = init_test();
const attendance_code_length = require('../plugins/codeGenerator').attendance_code_length;

lab.experiment('Code Generator', () => {

    lab.test('class begin works correctly', done => {
        server.methods.attendance.classBegin(1, (err, result) => {
            expect(result).to.be.string();
            expect(result).to.have.length(attendance_code_length);
        });
        done();

    });

    lab.test('class end works correctly', done => {
        server.methods.attendance.classBegin(1, (err, result) => {
            expect(result).to.be.string();
            expect(result).to.have.length(attendance_code_length);
            server.methods.attendance.classOver(1, (err, result1) => {
                expect(result1).to.equal({ success: true });
            });
        });
        done();
    });

    lab.test('class end errors out successfully', done => {
        server.methods.attendance.classOver(1, (err, result1) => {
            expect(result1).to.equal({ success: false });
        });
        done();
    });

    lab.test('get all the codes correctly', done => {
        server.methods.attendance.classBegin(1, (err, result) => {
            expect(result).to.be.string();
            expect(result).to.have.length(attendance_code_length);
            var codes = server.methods.attendance.code();
            expect(codes).to.be.object();
            expect(codes[1]).to.exist();
        });
        done();
    });

    lab.test('set code works correctly when a code does not already exist', done => {
        var result = server.methods.attendance.setCode(1, '000000');
            expect(result).to.be.string();
            expect(result).to.have.length(attendance_code_length);
            expect(result).to.equal('000000')
        done();
    });

    lab.test('set code works correctly when a code already exists', done => {
         server.methods.attendance.classBegin(1, (err, result) => {
            expect(result).to.be.string();
            expect(result).to.have.length(attendance_code_length);
            var result1 = server.methods.attendance.setCode(1, '000000');
            expect(result1).to.be.string();
            expect(result1).to.have.length(attendance_code_length);
            expect(result1).to.equal('000000')
            });
        done();
    });

    lab.test('class check returns true with correct code', done => {
        server.methods.attendance.classBegin(1, (err, result) => {
            expect(result).to.be.string();
            expect(result).to.have.length(attendance_code_length);
            server.methods.attendance.checkCode(1, result, (err, result1) => {
                expect(result1).to.equal(true);
            });
        });
        done();
    });

    lab.test('class check returns false with wrong code', done => {
        server.methods.attendance.classBegin(1, (err, result) => {
            expect(result).to.be.string();
            expect(result).to.have.length(attendance_code_length);
            server.methods.attendance.checkCode(1, 'aaaaaa', (err, result1) => {
                expect(result1).to.equal(false);
            });
        });
        done();
    });

    lab.test('class check returns false with error when invalid seq_id', done => {
        server.methods.attendance.classBegin(1, (err, result) => {
            expect(result).to.be.string();
            expect(result).to.have.length(attendance_code_length);
            server.methods.attendance.checkCode(100000, result, (err, result1) => {
                expect(err).to.equal(true);
                expect(result1).to.equal(false);
            });
        });
        done();
    });

});

