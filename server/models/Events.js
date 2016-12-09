'use strict';

const Model = require('objection').Model;
const db = require('../db');

class Events extends Model {
    static get tableName() { return 'Events'; }

    static get relationMappings() {
        return {
            eventTypes: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/eventTypes',
                join: {
                    from: 'Events.eventsTypes_id',
                    to: 'EventTypes.id'
                }
            },
            games: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + '/Games',
                join: {
                    from: 'Events.game_id',
                    to: 'Games.id'
                }
            },
            players: {
                relation: Model.HasOneRelation,
                modelClass: __dirname + '/Players',
                join: {
                    from: 'Events.players_id',
                    to: 'Players.id'
                }
            }
        }
    }
}

module.exports = Events;
