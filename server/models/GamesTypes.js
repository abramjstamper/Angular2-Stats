'use strict';

const Model = require('objection').Model;
const db = require('../db');

class GamesTypes extends Model {
    static get tableName() { return 'GamesTypes'; }

    static get relationMappings() {
        return {
            games: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/GamesTypes',
                join: {
                    from: 'GamesTypes.id',
                    to: 'Games.GamesTypes_id'
                }
            }
        }
    }
}

module.exports = GamesTypes;
