const Joi = require('joi');
const Boom = require('boom');

const Events = require('../models/Events');

exports.register = function (server, options, next) {
    server.route({
        method: 'GET',
        path: '/games/{game_id}/events',
        handler: function (request, reply) {
            Games
                .query()
                .eager('events')
                .then((game) => {
                    reply(game);
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'retrieves all the game events for a particular game'
        }
    });

    server.route({
        method: 'GET',
        path: '/events/{event_id}',
        handler: function (request, reply) {
            Events
                .query()
                .findById(request.params.event_id)
                .eager('eventType')
                .then((event) => {
                    if (event)
                        reply(event);
                    else
                        reply(Boom.notFound('Event ID ' + request.params.event_id + ' was not found!'));
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'retrieves a given event for a given event_id',
            validate: {
                params: {
                    event_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/games/{game_id}/events',
        handler: function (request, reply) {
            Event
                .query()
                .insert({
                    game_id: request.payload.game_id,
                    eventType_id: request.payload.eventType_id,
                    player_id: request.payload.player_id,
                    team_id: request.payload.team_id
                })
                .then((course) => {
                    reply(course);
                })
                .catch((err) => {
                    reply(Boom.badRequest(err));
                });
        },
        config: {
            notes: 'creates a new event with the given information',
            validate: {
                payload: {
                    game_id: Joi.number().positive().integer(),
                    eventType_id: Joi.number().positive().integer(),
                    player_id: Joi.number().positive().integer(),
                    team_id: Joi.number().positive().integer()
                }
            }
        }
    });

    next();
};

exports.register.attributes = { name: 'events', version: '0.0.1' };