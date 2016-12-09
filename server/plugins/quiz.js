'use strict';

const Boom = require('boom');

const Activity = require('../models/Activity');

exports.register = function (server, options, next) {

    server.route(
        {
            method: 'GET',
            path: '/activities',
            handler: function (request, reply) {
                Activity
                    .query()
                    .then(activities => {
                        reply(activities);
                    })
                    .catch(err => {
                        reply(Boom.badImplementation(err));
                    })
            }
        }
    )

    next();
};

exports.register.attributes = { name: 'quiz', version: '0.0.1' };
