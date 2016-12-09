const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Boom = require('boom');
const saltRounds = 10;

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {
            User
                .query()
                .then((users) => {
                    reply(users);              
                }).catch((err) => {
                    return reply(Boom.badImplementation('Uh oh! Something went wrong!', err));
            });
        },
        config: {
            auth: false,
            notes: 'returns all the user objects'
        }
    });

    server.route({
        method: 'GET',
        path: '/users/{user_id}',
        handler: function (request, reply) {
            User
                .query()
                .findById(request.params.user_id)
                .first()    
                .then((user) => {
                    reply(user.stripPassword())
                }).catch(function (err) {
                    return reply(Boom.badImplementation('Uh oh! Something went wrong!', err));
            });
        },
        config: {
            notes: 'returns a user given a valid user_id',
            validate: {
                params: {
                    user_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/users',
        handler: function (request, reply) {
            var hash = bcrypt.hashSync(request.payload.password, saltRounds);
            User
                .query()
                .insert({
                    first_name: request.payload.first_name,
                    last_name: request.payload.last_name,
                    email: request.payload.email,
                    password: hash
                })
                .then((user) => {
                    user.stripPassword();
                    reply(user);
                }).catch((err) => {
                    return reply(Boom.badRequest('Failed to create a new user', err));
            });

        },
        config: {
            auth: false,
            notes: 'Creates a standard user',
            validate: {
                payload: {
                    first_name: Joi.string().required(),
                    last_name: Joi.string().required(),
                    email: Joi.string().email().lowercase().required(),
                    password: Joi.string().required()
                }
            }
        }
    });

    next();
};

exports.register.attributes = {name: 'users', version: '0.0.1'};
