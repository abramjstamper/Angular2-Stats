'use strict';

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) {
            return reply('This is a confirmation of a working instantiation of a socket with NES!');
        },
        config: {
            id: 'hello'
        }
    });

    next();
};

exports.register.attributes = {name: 'sockets_nes', version: '0.0.2'};