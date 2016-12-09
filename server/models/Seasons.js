'use strict';

const db = require('../db');

class Seasons extends db.Model {
    static get tableName() {
        return 'Seasons';
    }

    static get relationMappings() {
        return {
            teams: {
                relation: db.Model.HasManyRelation,
                modelClass: __dirname + '/Teams',
                join: {
                    from: 'Seasons.id',
                    to: 'Teams.seasons_id'
                }
            }
        }
    }
}

module.exports = Seasons;
