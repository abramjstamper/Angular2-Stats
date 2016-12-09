'use strict';

const db = require('../db');

class Games extends db.Model {
    static get tableName() {
        return 'Games';
    }

    static get relationMappings() {
        return {
            gamesTypes: {
                relation: db.Model.BelongsToOneRelation,
                modelClass: __dirname + '/GamesTypes',
                join: {
                    from: 'Games.GamesTypes_id',
                    to: 'GamesTypes.id'
                }
            },
            gamesKinds: {
                relation: db.Model.BelongsToOneRelation,
                modelClass: __dirname + '/GamesKinds',
                join: {
                    from: 'Games.gameRules_id',
                    to: 'GamesKinds.id'
                }
            },
            teams: {
                relation: db.Model.ManyToManyRelation,
                modelClass: __dirname + '/Teams',
                join: {
                    from: 'Game.id',
                    join: {
                        from: 'GamesTeams.games_id',
                        to: 'GamesTeams.teams_id'
                    },
                    to: 'Teams.id'
                }
            },
            officials: {
                relation: db.Model.ManyToManyRelation,
                modelClass: __dirname + '/officials',
                join: {
                    from: 'Game.id',
                    join: {
                        from: 'GamesOfficials.games_id',
                        to: 'GamesOfficials.officials_id'
                    },
                    to: 'Officials.id'
                }
            },
            events: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Events',
                join: {
                    from: 'Events.game_id',
                    to: 'Games.id'
                }
            },
        }
    }
}

module.exports = Games;
