'use strict';

const Model = require('objection').Model;
const db = require('../db');

class GamesKinds extends Model {
    static get tableName() { return 'GamesKinds'; }

    static get relationMappings() {
        return {
            games: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/Games',
                join: {
                    from: 'GamesKinds.id',
                    to: 'Games.GameKinds_id'
                }
            }
        }
    }
}

module.exports = GamesKinds;
