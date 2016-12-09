const Joi = require('joi');
const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../models/User');
var uuid = 1;

exports.register = function (server, options, next) {

    //creates the cache segment 'sessions' in the server to store cookie info
    const cache = server.cache({ segment: 'sessions', expiresIn: 24 * 60 * 60 * 1000 });
    server.app.cache = cache;

    //defaults to set authentication on all routes
    server.auth.strategy('basic', 'cookie', {
        cookie: 'statistics-cookie',                        //cookie name
        isSecure: false,                                    //set to true for production apps
        password: '01234567890123456789012345678912',       //cookie secret
        redirectTo: false,                                  //client is handling
        ttl: 24 * 60 * 60 * 1000,                           //expires in 1 day
        clearInvalid: true,                                 //auth cookie that fails validation will be marked as expired
        validateFunc: function (request, session, callback) {
            cache.get(session.sid, (err, value, cached, report) => {
                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.item);
            });
        }
    });

    //secures all routes
    server.auth.default({ strategy: 'basic' });

    server.route({
        method: 'POST',
        path: '/login',
        handler: function (request, reply) {
            User
                .query()
                .where('email', request.payload.email)
                .first()
                .then((user) => {
                    //checks that the user password was matched with the DB password
                    bcrypt.compare(request.payload.password, user.password, (err, isValid) => {
                        if (!isValid) {
                            if (err) {
                                return reply(Boom.badRequest(err));
                            }
                            return reply(Boom.unauthorized('Invalid password'));
                        }
                        const sid = String(++uuid);

                        //Removes information from user object passed to browser and stored in the cache
                        user.stripPassword();

                        //Sets the user object in the cache
                        server.app.cache.set(sid, user, 0, (err) => {
                            if (err) {
                                return reply(Boom.badRequest('Failed to set session ID ' + sid + ' for user ' + user.first_name + ' ' + user.last_name, err));
                            }
                            //Sets the cookie up and gives it back to the browser
                            request.cookieAuth.set({ sid: sid });
                            reply(user);
                         });
                    });

                }).catch(() => {
                    return reply(Boom.unauthorized('Invalid username or password'));
                });
        },
        config: {
            auth: false,
            notes: 'Compares the password give by the payload with the password in the server and checks to make' +
            ' sure the user exists. If auth, gives the browser back a cookie and stores the cookie in the cache',
            validate: {
                payload: {
                    email: Joi.string().email().lowercase().required(),
                    password: Joi.string().required()
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/login',
        handler: function (request, reply) {
            var user = request.auth.credentials;
            if(user)
                reply(user);
            else
                reply({});
        },
        config: {
            auth: {mode: 'optional'},
            notes: 'Returns the current user object without the password, null if not logged in'
        }
    });

    server.route({
        method: 'POST',
        path: '/logout',
        handler: function (request, reply) {
            server.app.cache.drop(request.auth.artifacts.sid, (err) => {
                if (err) {
                    return reply(Boom.badImplementation('Couldn\'t drop cache entry for user', err));
                }
            });
            request.cookieAuth.clear();
            return reply({ statusCode: 200, message: 'Logout successful', success: true });
        },
        config: {
            notes: 'Removes session token from the browser & server\'s cache'
        }
    });

    next();
};

exports.register.attributes = { name: 'authentication', version: '0.0.5' };