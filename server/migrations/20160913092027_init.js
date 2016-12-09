exports.up = function (knex, Promise) {

    return Promise.all([

        //orange - user
        knex.schema.createTableIfNotExists('Users', function (table) {
            table.increments('id').primary();
            table.string('first_name');
            table.string('last_name');
            table.string('email').unique().notNullable();
            table.string('password').notNullable();
            table.string('mobile_phone')
        }),

        knex.schema.createTableIfNotExists('GamesKinds', function (table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.boolean('isPreseason').defaultTo(false);
            table.boolean('isPostseason').defaultTo(false);
        }),

        knex.schema.createTableIfNotExists('GamesTypes', function (table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.json('rules').notNullable();
        }),

        knex.schema.createTableIfNotExists('Officials', function (table) {
            table.increments('id').primary();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
        }),

    knex.schema.createTableIfNotExists('Seasons', function (table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.date('startYear').notNullable();
            table.date('endYear').notNullable();
        }),

    knex.schema.createTableIfNotExists('Teams', function (table) {
            table.increments('id').primary();
            table.string('hometown');
            table.string('name').notNullable();;
            table.string('coachName');
            table.string('mascot');
            table.string('displayName').notNullable();
            table.boolean('isMen').defaultTo('false').notNullable();
            table.string('primaryColor').defaultTo('ffffff').notNullable();
            table.string('secondaryColor').defaultTo('000000').notNullable();
            table.string('assistantCoach1');
            table.string('assistantCoach2');
            table.string('trainer');
            table.string('athleticDirector');
            table.integer('seasons_id')
                .unsigned()
                .nullable()
                .references('id')
                .inTable('Seasons');
        }),

        knex.schema.createTableIfNotExists('Players', function (table) {
            table.increments('id').primary();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.integer('homeNumber').notNullable();
            table.integer('awayNumber').notNullable();
            table.boolean('isActive').notNullable().defaultTo(true);
            table.integer('heightInches');
            table.integer('weightLBS');
            table.integer('teams_id')
                .unsigned()
                .notNullable();
            table.foreign('teams_id').references('Teams.id');
        }),

        knex.schema.createTableIfNotExists('Games', function (table) {
            table.increments('id').primary();
            table.datetime('startTime').notNullable();
            table.string('name');
            table.string('location');
            table.boolean('isNeturalLocation').defaultTo(false).notNullable();
            table.integer('attendance');
            table.integer('gamesTypes_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('GamesTypes');
            table.integer('gamesKinds_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('GamesKinds');
        }),

        //Golden - departments
        knex.schema.createTableIfNotExists('UsersTeams', function (table) {
            table.integer('users_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('Users');
            table.integer('teams_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('Teams');
            table.primary(['teams_id', 'users_id']);
        }),

        knex.schema.createTableIfNotExists('GamesOfficials', function (table) {
            table.integer('officials_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('Officials');
            table.integer('games_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('Games');
            table.primary(['officials_id', 'games_id']);
        }),

        knex.schema.createTableIfNotExists('EventTypes', function (table) {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.boolean('isOffense').defaultTo('false').notNullable();
        }),

        knex.schema.createTableIfNotExists('Events', function (table) {
            table.increments('id').primary();
            table.integer('games_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('Games');
            table.integer('eventTypes_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('EventTypes');
            table.integer('players_id')
                .unsigned()
                .nullable()
                .references('id')
                .inTable('Players');
            table.integer('teams_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('Teams');
        }),
        knex.schema.createTableIfNotExists('GamesTeams', function (table) {
            table.integer('teams_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('Teams');
            table.integer('games_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('Games');
            table.primary(['teams_id', 'games_id']);
        }),
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        //fk tables
        knex.schema.dropTableIfExists('GamesTeams'),
        knex.schema.dropTableIfExists('GamesOfficials'),
        knex.schema.dropTableIfExists('Events'),
        knex.schema.dropTableIfExists('UsersTeams'),
        knex.schema.dropTableIfExists('Players'),
        knex.schema.dropTableIfExists('Games'),

        //pk tables
        knex.schema.dropTableIfExists('Teams'),
        knex.schema.dropTableIfExists('Seasons'),
        knex.schema.dropTableIfExists('EventType'),
        knex.schema.dropTableIfExists('GameRules'),
        knex.schema.dropTableIfExists('Officials'),
        knex.schema.dropTableIfExists('Users'),
    ]);
};



