'use strict';

import { init_test, expect, server, db } from './support';
const lab = exports.lab = init_test();

const User = require('../models/User');
const Section = require('../models/Section');
const ActualClass = require('../models/ActualClass');

lab.experiment('/Execution endpoint', () => {

    var section = null;
    var user = null;

    lab.beforeEach(done => {

        return Promise.all([
            db.knex.raw(
                'TRUNCATE public.department CASCADE; ' +
                'TRUNCATE public.prefix CASCADE; ' + 
                'TRUNCATE public.user CASCADE; ' +
                'TRUNCATE public.term CASCADE; '
                )
        ])
            .then(results => {
                return Promise.all([
                    User
                        .query()
                        .insert({
                            id: 1,
                            first_name: "Sammy",
                            last_name: "Morris",
                            email: 'sam@example.com',
                            mobile_phone: '0123456789',
                            office_phone: '0123456789',
                            password: 'pass'
                        }),
                    Section
                        .query()
                        .insertWithRelated({
                            title: 'Section xyz',
                            reg_number: '123456',
                            credit_hours: 3,
                            sequence: {
                                title: 'seq xyz',
                                offering: {
                                    course: {
                                        '#id': 'this_course',
                                        title: 'Course Title',
                                        number: '123',
                                        prefix: {
                                            name: 'COS'
                                        },
                                        department: {
                                            name: 'CSE Department'
                                        }
                                    }
                                }
                            },
                            course: {
                                '#ref': 'this_course'
                            },
                            term: {
                                name: 'Fall 2016',
                                start_date: '2016-09-01',
                                end_date: '2016-12-15'
                            }
                        })
                ])
            }).then(results => {
                user = results[0];
                section = results[1];

            })
            .catch(err => {
                console.log("ERROR", err);
            });

    });

    // No need to invoke done();  According to documentation,
    // you can return a promise instead.

    lab.test('Start class successfully', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/classes`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist()
                expect(response.sequence_id).to.equal(section.sequence.id);
                expect(response.start_time).to.exist();
                expect(response.code).to.exist();
                expect(response.stop_time).to.not.exist();
                done();
            });
    });

    lab.test('Error out if section is not found', (done) => {

        server.inject(
            {
                method: 'DELETE',
                credentials: user,
                url: `/sections/100000000/classes`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 100000000 was not found!');
                done();
            });
    });

    lab.test('Error out if section is not found', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/100000000/classes`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 100000000 was not found!');
                done();
            });
    });

    lab.test('Error out on a double start class', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/classes`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist()
                expect(response.sequence_id).to.equal(section.sequence.id);
                expect(response.start_time).to.exist();
                expect(response.code).to.exist();
                expect(response.stop_time).to.not.exist();
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/sections/${section.id}/classes`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(400);
                        const response = JSON.parse(res.payload);
                        expect(response.error).to.equal('Bad Request');
                        expect(response.message).to.equal('Class is already in session!');
                        done();
                    });
            });
    });

    lab.test('End class successfully', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/classes`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist()
                expect(response.sequence_id).to.equal(section.sequence.id);
                expect(response.start_time).to.exist();
                expect(response.code).to.exist();
                expect(response.stop_time).to.not.exist();

                server.inject(
                    {
                        method: 'DELETE',
                        credentials: user,
                        url: `/sections/${section.id}/classes`
                    },
                    (res2) => {
                        expect(res2.statusCode).to.equal(200);
                        const response = JSON.parse(res2.payload);
                        expect(response.id).to.exist()
                        expect(response.sequence_id).to.equal(section.sequence.id);
                        expect(response.start_time).to.exist();
                        expect(response.stop_time).to.exist();
                        done();
                    });
            });
    });

    lab.test('Error out if you try to stop a class that hasn\'t been started', (done) => {

        server.inject(
            {
                method: 'DELETE',
                credentials: user,
                url: `/sections/${section.id}/classes`,
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal('Class has not been started or has already ended for the day!');
                done();
            });
    });
});