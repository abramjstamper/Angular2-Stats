'use strict';

const Model = require('objection').Model;
const db = require('../db');

class Players extends Model {
    static get tableName() { return 'Players'; }

    static get relationMappings() {
        return {
            teams: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Teams',
                join: {
                    from: 'Players.teams_id',
                    to: 'Teams.id'
                }
            },
            events: {
                relation: Model.HasManyRelation,
                modelClass: __dirname + '/Events',
                join: {
                    from: 'Players.id',
                    to: 'Events.Players_id'
                }
            }
        }
    }
}

module.exports = Players;
