'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Teams = require('../models/Teams');
const Seams = require('../models/Seasons');

exports.register = function (server, options, next) {

    server.route({
        method: 'POST',
        path: '/teams/{team_id}/players/{player_id}',
        handler: function (request, reply) {
            Teams
                .query()
                .findById(request.params.team_id)
                .then((teams) => {
                    return teams.$relatedQuery('players').relate(request.params.player_id);
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'Add a player to a given team',
            validate: {
                params: {
                    team_id: Joi.number().positive().integer(),
                    player_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/teams/{team_id}/players/{player_id}',
        handler: function (request, reply) {
            Teams
                .query()
                .findById(request.params.team_id)
                .then((teams) => {
                    return teams.$relatedQuery('players').unrelate(request.params.player_id);
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'Removes a player to a given team',
            validate: {
                params: {
                    team_id: Joi.number().positive().integer(),
                    player_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/seasons/{season_id}/teams',
        handler: function (request, reply) {
            Teams
                .query()
                .where('seasons_id', request.params.seasons_id)
                .then((teams) => {
                    reply(teams);
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'lists all the teams from a given season',
            validate: {
                params: {
                    season_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/seasons/{season_id}/teams',
        handler: function (request, reply) {
            Teams
                .query()
                .insert({
                    name: request.payload.name,
                    hometown: request.payload.hometown,
                    coachName: request.payload.coachName,
                    mascot: request.payload.mascot,
                    displayName: request.payload.displayName,
                    isMen: request.payload.isMen,
                    primaryColor: request.payload.primaryColor,
                    secondaryColor: request.payload.secondaryColor,
                    assistantCoach1: request.payload.assistantCoach1,
                    assistantCoach2: request.payload.assistantCoach2,
                    trainer: request.payload.trainer,
                    athleticDirector: request.payload.athleticDirector,
                    seasons_id: request.params.season_id
                })
                .then((team) => {
                    reply(team);
                })
                .catch((err) => {
                    reply(Boom.badRequest(err));
                });
        },
        config: {
            notes: 'creates a new team within a given season',
            validate: {
                params: {
                    season_id: Joi.number().positive().integer()
                },
                payload: {
                    name: Joi.string().max(255).required(),
                    hometown: Joi.string().max(255),
                    coachName: Joi.string().max(255).required(),
                    mascot: Joi.string().max(255),
                    displayName: Joi.string().max(12).required(),
                    isMen: Joi.boolean().default(true),
                    primaryColor: Joi.string().max(12).required(),
                    secondaryColor: Joi.string().max(12).required(),
                    assistantCoach1: Joi.string().max(255),
                    assistantCoach2: Joi.string().max(255),
                    trainer: Joi.string().max(255),
                    athleticDirector: Joi.string().max(255),
                    seasons_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/teams',
        handler: function (request, reply) {
            Teams
                .query()
                .then((teams) => {
                    reply(teams);
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'lists all the teams'
        }
    });

    server.route({
        method: 'GET',
        path: '/teams/{team_id}',
        handler: function (request, reply) {
            Teams
                .query()
                .where('id', request.params.team_id)
                .first()
                .then((team) => {
                    if (team)
                        reply(team);
                    else
                        reply(Boom.notFound('Team ID ' + request.params.team_id + ' was not found!'));
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'retrieves a team',
            validate: {
                params: {
                    team_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'PUT',
        path: '/teams/{team_id}',
        handler: function (request, reply) {
            Teams
                .query()
                .patchAndFetchById(request.params.team_id, {
                    name: request.payload.name,
                    hometown: request.payload.hometown,
                    coachName: request.payload.coachName,
                    mascot: request.payload.mascot,
                    displayName: request.payload.displayName,
                    isMen: request.payload.isMen,
                    primaryColor: request.payload.primaryColor,
                    secondaryColor: request.payload.secondaryColor,
                    assistantCoach1: request.payload.assistantCoach1,
                    assistantCoach2: request.payload.assistantCoach2,
                    trainer: request.payload.trainer,
                    athleticDirector: request.payload.athleticDirector
                })
                .then((team) => {
                    reply(team);
                })
                .catch((err) => {
                    reply(Boom.badRequest(err));
                });
        },
        config: {
            notes: 'Updates a given team',
            validate: {
                params: {
                    team_id: Joi.number().positive().integer()
                },
                payload: {
                    name: Joi.string().max(255).required(),
                    hometown: Joi.string().max(255),
                    coachName: Joi.string().max(255).required(),
                    mascot: Joi.string().max(255),
                    displayName: Joi.string().max(12).required(),
                    isMen: Joi.boolean().default(true),
                    primaryColor: Joi.string().max(12).required(),
                    secondaryColor: Joi.string().max(12).required(),
                    assistantCoach1: Joi.string().max(255),
                    assistantCoach2: Joi.string().max(255),
                    trainer: Joi.string().max(255),
                    athleticDirector: Joi.string().max(255)
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/seasons',
        handler: function (request, reply) {
            Seasons
                .query()
                .then((seasons) => {
                    reply(seasons);
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'lists all the seasons'
        }
    });

    server.route({
        method: 'GET',
        path: '/seasons/{seasons_id}',
        handler: function (request, reply) {
            Seasons
                .query()
                .where('id', request.params.seasons_id)
                .first()
                .then((seasons) => {
                    if (seasons)
                        reply(seasons);
                    else
                        reply(Boom.notFound('Season ID ' + request.params.seasons_id + ' was not found!'));
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'retrieves a season object from the database',
            validate: {
                params: {
                    seasons_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/seasons',
        handler: function (request, reply) {
            Seasons
                .query()
                .insert({
                    name: request.payload.name,
                    startYear: request.payload.startYear,
                    endYear: request.payload.endYear
                })
                .then((season) => {
                    reply(season);
                })
                .catch((err) => {
                    reply(Boom.badRequest(err));
                });
        },
        config: {
            notes: 'creates a new season',
            validate: {
                payload: {
                    name: Joi.string().max(255).required(),
                    startYear: Joi.date(),
                    endYear: Joi.date()
                }
            }
        }
    });

    next();
};

exports.register.attributes = { name: 'teams', version: '0.0.1' };
