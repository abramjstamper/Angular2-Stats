const Joi = require('joi');
const Boom = require('boom');

const Prefix = require('../models/Players');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/players/{player_id}',
        handler: function (request, reply) {
            Player
                .query()
                .findById(player_id)
                .then((player) => {
                    if (player)
                        reply(player);
                    else
                        reply(Boom.notFound('Player ID ' + request.params.player_id + ' was not found!'))
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'Retrieves a given player from the databse',
            validate: {
                params: {
                    player_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/players',
        handler: function (request, reply) {
            Players
                .query()
                .insert({
                    firstName: request.payload.firstName,
                    lastName: request.payload.lastName,
                    homeNumber: request.payload.homeNumber,
                    awayNumber: request.payload.awayNumber,
                    isActive: request.payload.isActive,
                    height: request.payload.height,
                    weight: request.payload.weight,
                    teams_id: request.payload.teams_id
                })
                .then((player) => {
                    reply(player);
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            validate: {
                payload: {
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                    homeNumber: Joi.number().required().positive().integer(),
                    awayNumber: Joi.number().required().positive().integer(),
                    isActive: Joi.boolean().required().default(true),
                    height: Joi.number().positive().integer(),
                    weight: Joi.number().positive().integer(),
                    teams_id: Joi.number().required().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/players/{player_id}',
        handler: function (request, reply) {
            Players
                .query()
                .patchAndFetchById(request.params.player_id, {
                    firstName: request.payload.firstName,
                    lastName: request.payload.lastName,
                    homeNumber: request.payload.homeNumber,
                    awayNumber: request.payload.awayNumber,
                    isActive: request.payload.isActive,
                    height: request.payload.height,
                    weight: request.payload.weight,
                    teams_id: request.payload.teams_id
                })
                .then((prefix) => {
                    reply(prefix);
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'Updates a player\'s information given a player_id',
            validate: {
                params: {
                    player_id: Joi.number().positive().integer()
                },
                payload: {
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                    homeNumber: Joi.number().required().positive().integer(),
                    awayNumber: Joi.number().required().positive().integer(),
                    isActive: Joi.boolean().required().default(true),
                    height: Joi.number().positive().integer(),
                    weight: Joi.number().positive().integer(),
                    teams_id: Joi.number().required().positive().integer()
                }
            }
        }
    });

    next();
};

exports.register.attributes = { name: 'players', version: '0.0.1' };