'use strict';

const Model = require('objection').Model;
const db = require('../db');

class User extends Model {
    static get tableName() {
        return 'user';
    }

    static get relationMappings() {
        return {
            role: {
                relation: Model.ManyToManyRelation,
                modelClass: __dirname + '/Teams',
                join: {
                    from: 'user.id',
                    through: {
                        from: 'UsersTeams.users_id',
                        to: 'UsersTeams.teams_id'
                    },
                    to: 'Teams.id'
                }
            }
        }
    }

    fullName() {
        return this.firstName + ' ' + this.lastName
    }

    stripPassword() {
        delete this['password']
        return this;
    }

    isAdmin() { return this.isAdmin; }
}

module.exports = User;
