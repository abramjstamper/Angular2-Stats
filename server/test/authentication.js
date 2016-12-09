'use strict';

import { init_test, expect, server, db } from './support';
const lab = exports.lab = init_test();

const User = require('../models/User');

lab.experiment('/login endpoint', () => {

    var users = null;

    lab.beforeEach(done => {

        return Promise.all([
            db.knex.raw('TRUNCATE public.user CASCADE')
        ]).then(results => {
            return Promise.all([
                User.query().insertWithRelated([{
                    first_name: "Patty",
                    last_name: "O'Furniture",
                    email: 'patty@example.com',
                    password: '$2a$10$UzIsxXsVTPTru5NjfSXy.uGiptYgFmtfNrYCU9BzjIp2YEEXLUCGG'
                },
        	    {
                    first_name: "Sammy",
                    last_name: "Morris",
                    email: 'sam@example.com',
                    password: '$2a$10$UzIsxXsVTPTru5NjfSXy.uGiptYgFmtfNrYCU9BzjIp2YEEXLUCGG',
                    mobile_phone: '0123456789',
                    office_phone: '0123456789'
                }])
                .then((collection) => {
                    users = collection;
                })
            ]);
        }).catch(err => {
            console.log("ERROR", err);
        });

    });

    // No need to invoke done();  According to documentation,
    // you can return a promise instead.

    lab.test('Log in passes', (done) => {

        server.inject(
            {
                method: 'POST',
                url: '/login',
                payload: {
                    email: 'patty@example.com',
                    password: 'pass',
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const header = res.headers['set-cookie'].toString();
                const response = JSON.parse(res.payload);
                expect(header).startsWith('faraday-cookie=');
                expect(response.id).to.equal(users[0].id);
                expect(response.first_name).to.equal('Patty');
                expect(response.last_name).to.equal('O\'Furniture');
                expect(response.email).to.equal('patty@example.com');
                expect(response.password).to.not.exist();
                done();
            });
    });

    lab.test('Log out passes', (done) => {

        server.inject(
            {
                method: 'POST',
                url: '/login',
                payload: {
                    email: 'patty@example.com',
                    password: 'pass',
                }
            },
            (res) => {
                const header = res.headers['set-cookie'];
                expect(header.length).to.equal(1);
                const cookie = header[0].match(/(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);

                server.inject(
                    {
                        method: 'POST',
                        url: '/logout',
                        headers: { cookie: 'faraday-cookie=' + cookie[1] }
                    },
                    (res2) => {
                        expect(res2.statusCode).to.equal(200);
                        const response = JSON.parse(res2.payload);
                        const cookie = res2.headers['set-cookie'].toString().split('; ');
                        expect(response.message).to.equal('Logout successful');
                        expect(cookie[2]).to.equal('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
                        expect(response.success).to.equal(true);
                        done();
                });
            });
    });

    lab.test('Login fails with bad password', (done) => {
        server.inject(
            {
                method: 'POST',
                url: '/login',
                payload: {
                    email: 'sam@example.com',
                    password: 'badPassword',
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(401);
                const response = JSON.parse(res.payload);
                expect(response.message).to.equal('Invalid password');
                done();
            });
    });

    lab.test('Login fails with email that does not exist in the database', (done) => {
        server.inject(
            {
                method: 'POST',
                url: '/login',
                payload: {
                    email: 'iDontExistInTheDatabase@example.com',
                    password: 'pass',
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(401);
                const response = JSON.parse(res.payload);
                expect(response.message).to.equal('Invalid username or password');
                done();
            });
    });

    lab.test('Checks the current user route to make sure it returns the current user object', (done) => {
        var user = {
            id: '10000',
            first_name: "Milo",
            last_name: "Rediger",
            email: 'milo@example.com',
            mobile_phone: '0123456789',
            office_phone: '0123456789'
        };

        server.inject(
            {
                method: 'GET',
                url: '/login',
                credentials: user
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal('10000');
                expect(response.first_name).to.equal('Milo');
                expect(response.last_name).to.equal('Rediger');
                expect(response.email).to.equal('milo@example.com');
                expect(response.password).to.not.exist();
                done();
            });
    });

    lab.test('Checks the current user route to make sure it returns 401 if not logged in', (done) => {

        server.inject(
            {
                method: 'GET',
                url: '/login',
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.equal({});
                done();
            });
    });

});