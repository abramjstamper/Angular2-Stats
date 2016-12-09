'use strict';

const Model = require('objection').Model;
const db = require('../db');

class Teams extends Model {
    static get tableName() { return 'Teams'; }

    static get relationMappings() {
        return {
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + '/Users',
                join: {
                    from: 'Teams.id',
                    join: {
                        from: 'UsersTeams.teams_id',
                        to: 'UsersTeams.users_id'
                    },
                    to: 'user.id'
                }
            },
            games: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + '/Games',
                join: {
                    from: 'Games.id',
                    join: {
                        from: 'GamesTeams.games_id',
                        to: 'GameTeams.teams_id'
                    },
                    to: 'Teams.id'
                }
            },
            seasons: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Seasons',
                join: {
                    from: 'Teams.seasons_id',
                    to: 'Seasons.id'
                }
            }
        }
    }
}

module.exports = Teams;
