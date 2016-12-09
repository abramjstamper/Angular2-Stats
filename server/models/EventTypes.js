'use strict';

const db = require('../db');

class EventTypes extends db.Model {
    static get tableName() {
        return 'EventTypes';
    }

    static get relationMappings() {
        return {
            events: {
                relation: db.Model.HasManyRelation,
                modelClass: __dirname + '/Events',
                join: {
                    from: 'EventTypes.id',
                    to: 'Events.eventTypes_id'
                }
            }
        }
    }
}

module.exports = EventTypes;
