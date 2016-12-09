'use strict';

/**
 * Simple ping route for trivial testing.
 */

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/ping',
        handler: function (request, reply) {
            reply('pong');
        }
    });

    next();
};

exports.register.attributes = {name: 'ping', version: '0.0.1'};