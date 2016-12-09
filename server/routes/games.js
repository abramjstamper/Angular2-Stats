'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Teams = require('../models/Teams');
const Games = require('../models/Games');
const Officials = require('../models/Officials');
const GameKinds = require('../models/GamesKinds');
const GameTypes = require('../models/GamesTypes');

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/teams/{team_id}/games',
        handler: function (request, reply) {
            Team
                .query()
                .findById(request.params.team_id)
                .first()
                .then((team) => {
                    team
                        .$relatedQuery('games')
                        .then((games) => {
                            reply(games);
                        });
                })
                .catch(function (err) {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            validate: {
                params: {
                    team_id: Joi.number().positive().integer()
                }
            },
            notes: 'retrieves all the games for a given team (which is inherintly for a given season)'
        }
    });

    server.route({
        method: 'POST',
        path: '/teams/{team_id}/games/{game_id}',
        handler: function (request, reply) {
            Team
                .query()
                .findById(request.params.team_id)
                .first()
                .then((team) => {
                    team
                        .$relatedQuery('games')
                        .relate(request.params.game_id)
                        .then(() => {
                            reply("Team " + request.params.team_id + " has been added to game " + request.params.game_id + " successfully!");
                        });
                })
                .catch(function (err) {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            validate: {
                params: {
                    team_id: Joi.number().positive().integer()
                }
            },
            notes: 'associates a team with a game'
        }
    });

    server.route({
        method: 'GET',
        path: '/games',
        handler: function (request, reply) {
            Game
                .query()
                .then((game) => {
                    reply(game);
                })
                .catch(function (err) {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'retrieves all of the games',
            validate: {
                params: {
                    game_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/games/{game_id}',
        handler: function (request, reply) {
            Game
                .query()
                .findById(request.params.game_id)
                .then((game) => {
                    if (game != null)
                        reply(game);
                    else
                        reply(Boom.notFound('Game ID ' + request.params.game_id + ' was not found!'))
                })
                .catch(function (err) {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'retrieves a game',
            validate: {
                params: {
                    game_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/games',
        handler: function (request, reply) {
            Game
                .query()
                .insert({
                    startTime: request.payload.startTime,
                    name: request.payload.name,
                    location: request.payload.location,
                    isNeturalLocation: request.payload.isNeturalLocation,
                    attendance: request.payload.attendance
                })
                .then((game) => {
                    reply(game);
                })
                .catch(function (err) {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'creates a new game',
            validate: {
                payload: {
                    startTime: Joi.date().format('YYYY-MM-DD').required(),
                    name: Joi.string().max(255).required(),
                    location: Joi.string().max(255),
                    isNeturalLocation: Joi.boolean().default(false),
                    attendance: Joi.number().integer().positive()
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/games/{game_id}',
        handler: function (request, reply) {
            Game
                .query()
                .patchAndFetchById(request.params.game_id, {
                    startTime: request.payload.startTime,
                    name: request.payload.name,
                    location: request.payload.location,
                    isNeturalLocation: request.payload.isNeturalLocation,
                    attendance: request.payload.attendance
                })
                .then((game) => {
                    reply(game);
                })
                .catch(function (err) {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'Updates a game with the given information',
            validate: {
                params: {
                    game_id: Joi.number().positive().integer()
                },
                payload: {
                    startTime: Joi.date().format('YYYY-MM-DD').required(),
                    name: Joi.string().max(255).required(),
                    location: Joi.string().max(255),
                    isNeturalLocation: Joi.boolean().default(false),
                    attendance: Joi.number().integer().positive()
                }
            }
        }
    });

    next();
};

exports.register.attributes = { name: 'games', version: '0.0.1' };
