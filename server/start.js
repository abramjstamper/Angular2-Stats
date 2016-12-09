const Server = require('./server');

Server((err, server) => {
    if (err) {
        // Error during creation of server object
        throw err;
    }

    server.start((err) => {
        if (err) {
            // Error during startup of server
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});


