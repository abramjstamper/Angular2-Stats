'use strict';

const db = require('../db');

class Officials extends db.Model {
    static get tableName() {
        return 'Officials';
    }

    static get relationMappings() {
        return {
            games: {
                relation: db.Model.ManyToManyRelation,
                modelClass: __dirname + '/Games',
                join: {
                    from: 'Officials.id',
                    through: {
                        from: 'GamesOfficials.officials_id',
                        to: 'Games.games_id'
                    },
                    to: 'Games.id'
                }
            }
        }
    }
}

module.exports = Officials;

