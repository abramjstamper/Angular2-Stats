"use strict";

const DEBUG = true;

const Promise = require('bluebird');

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./test-db.sqlite"
    },
    debug: DEBUG,
    useNullAsDefault: true        // Quiet the sqlite3 driver
});

const Model = exports.Model = require('objection').Model;
Model.knex(knex);

class Role extends Model {
    static get tableName() {
        return 'role';
    }

    static get relationMappings() {
        return {
            user_roles: {
                relation: Model.OneToManyRelation,
                modelClass: UserRole,
                join: {
                    from: 'role.id',
                    to: 'user_role.role_id'
                }
            }
        }
    }
}

class UserRole extends Model {
    static get tableName() {
        return 'user_role';
    }

    static get relationMappings() {
        return {
            role: {
                relation: Model.BelongsToOneRelation,
                modelClass: Role,
                join: {
                    from: 'user_role.role_id',
                    to: 'role.id'
                }
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'user_role.user_id',
                    to: 'user.id'
                }
            }
        }
    }
}

class User extends Model {
    static get tableName() {
        return 'user';
    }

    static get relationMappings() {
        return {
            user_roles: {
                relation: Model.OneToManyRelation,
                modelClass: UserRole,
                join: {
                    from: 'user.id',
                    to: 'user_role.user_id'
                }
            },
            roles: {
                relation: Model.ManyToManyRelation,
                modelClass: Role,
                join: {
                    from: 'user.id',
                    through: {
                        from: 'user_role.user_id',
                        to: 'user_role.role_id'
                    },
                    to: 'role.id'
                }
            }
        }
    }
}

function reset_schema() {
    console.log("Reset schema");

    return Promise.join(
        knex.schema.dropTableIfExists('user'),
        knex.schema.dropTableIfExists('role'),
        knex.schema.dropTableIfExists('user_role'),
        () => console.log("Schema reset")
    );
}

function create_schema() {
    console.log("Create schema");

    return Promise.join(
        knex.schema.createTableIfNotExists('user', (table) => {
            table.increments('id').primary();
            table.string('first_name');
            table.string('last_name');
            table.string('email');
        }),

        knex.schema.createTableIfNotExists('role', (table) => {
            table.increments('id').primary();
            table.string('name');
        }),

        knex.schema.createTableIfNotExists('user_role', (table) => {
            table.integer('user_id').references('user.id');
            table.integer('role_id').references('role.id');
        }),

        () => console.log("Schema created")
    );
}

function insert_user(first_name, last_name, email, role_id) {
    return User.query().insert({first_name, last_name, email})
        .then(user => user.$relatedQuery('roles').relate(role_id))
}

function insert_data() {
    console.log("***** Insert data");

    return Promise.all([
        Role.query().insert({id: 10, name: 'President'}),
        Role.query().insert({id: 11, name: 'Manager'}),
        Role.query().insert({id: 12, name: 'VP'}),

        insert_user('Fred', 'Ziffle', 'fred@ziffle.com', 10),
        insert_user('Justin', 'Thyme', 'justin@thyme.com', 11),
        insert_user('Patty', "O'Furniture", 'patty@example.com', 12)
    ]);
}

function check_data() {
    console.log("***** Check data");

    return User.query()
        .then(users => console.log("USERS", users));
}

function unwedge_two_step() {
    console.log("***** Unwedge ORM");

    return User
        .query()
        .where('id', 2)
        .first()
        .then(user => {
            return user.$relatedQuery('user_roles');
        })
        .then(user_roles => console.log("USER ROLES", user_roles));
}

function unwedge_eager() {
    console.log("***** Unwedge eager");

    return User
        .query()
        .eager('user_roles')
        .then(users => console.log("USERS", JSON.stringify(users)));
}

function unwedge_m2m() {
    console.log("***** Unwedge many-to-many");

    return User
        .query()
        .where('id', 2)
        .first()
        .then(user => {
            return user.$relatedQuery('roles')
        }).then(roles => {
            console.log("ROLES", roles);
        });
}

function unwedge_m2m_eager() {
    console.log("***** Unwedge various eager");

    return Promise.all([
        User.query()
            .eager('roles')
            .then(users => console.log("USERS", users)),

        Role.query()
            .eager('[user_roles, user_roles.user]')
            .then(roles => console.log("ROLES", JSON.stringify(roles))),

        UserRole.query()
            .eager('role')
            .then(user_roles => {
                user_roles.forEach(user_role => {
                    console.log("USER ROLE", user_role);
                    console.log("ROLE", user_role.role_id);
                })
            })
    ]);
}

reset_schema()
    .then(create_schema)
    .then(insert_data)
    .then(check_data)
    .then(unwedge_two_step)
    .then(unwedge_eager)
    .then(unwedge_m2m)
    .then(unwedge_m2m_eager)
    .then(() => process.exit(1))
    .catch(err => console.error("ERR", err));

