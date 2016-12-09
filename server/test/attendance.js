'use strict';

import { init_test, expect, server, db } from './support';
const lab = exports.lab = init_test();

const User = require('../models/User');
const Section = require('../models/Section');
const ActualClass = require('../models/ActualClass');
var Nes = require('nes');
var Wreck = require('wreck');

lab.experiment('/attendance endpoint', () => {

    var section = null;
    var user = null;
    var actualClass = null;
    // var client = null;

    lab.beforeEach(done => {

        return Promise.all([
            db.knex.raw(
                'TRUNCATE public.department CASCADE; ' +
                'TRUNCATE public.prefix CASCADE; ' +
                'TRUNCATE public.user CASCADE; ' +
                'TRUNCATE public.term CASCADE; ' +
                'TRUNCATE public.actual_class CASCADE; '
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
                                },
                                actualClass: {
                                    id: 1,
                                    start_time: new Date()
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
                    .then((results) => {
                        user = results[0];
                        section = results[1];
                    })
            }).then(results => {
                server.methods.attendance.setCode(section.sequence_id, '000000');
            })
            .catch(err => {
                console.log("ERROR", err);
            });

    });

    lab.test('Attendance status route is successful - returning true', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/attendance`,
                payload: {
                    code: '000000'
                }
            },
            (res1) => {
                expect(res1.statusCode).to.equal(200);
                const response1 = JSON.parse(res1.payload);
                expect(response1.id).to.exist()
                expect(response1.user_id).to.equal(user.id);
                expect(response1.actual_class_id).to.equal(section.sequence.actualClass.id);
                expect(response1.id).to.exist();
                expect(response1.signed_in).to.exist();
                expect(response1.signed_out).to.not.exist();
                server.inject(
                    {
                        method: 'GET',
                        credentials: user,
                        url: `/sections/${section.id}/attendance`
                    },
                    (res2) => {
                        expect(res2.statusCode).to.equal(200);
                        const response2 = JSON.parse(res2.payload);
                        expect(response2.attending).to.be.true();
                        expect(response2.message).to.equal('You\'re already listed as attending for this class');
                        done();
                    });
            });
    });

    lab.test('Error out on invalid section for attendance status route', (done) => {

        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/sections/100000000/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.message).to.equal('Section ID 100000000 was not found!');
                done();
            });
    });

    lab.test('Attendance route successful - returning false - not started class', (done) => {
        ActualClass
            .query()
            .deleteById(section.sequence.actualClass.id)
            .then(() => {
                server.inject(
                    {
                        method: 'GET',
                        credentials: user,
                        url: `/sections/${section.id}/attendance`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(200);
                        const response = JSON.parse(res.payload);
                        expect(response.attending).to.be.false();
                        expect(response.message).to.equal('Your professor has not yet started class');
                        done();
                    });
            });
    });

    lab.test('Attendance route successful - returning false - not attending class', (done) => {

        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/sections/${section.id}/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.attending).to.be.false();
                expect(response.message).to.equal('You are not attending this class');
                done();
            });
    });

    lab.test('Retrieves all the actualClasses', (done) => {

        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/sections/${section.id}/classes`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                expect(response[0].id).to.exist();
                expect(response[0].start_time).to.exist();
                done();
            });
    });

    lab.test('Errors out if the section has no classes', (done) => {
        ActualClass
            .query()
            .deleteById(section.sequence.actualClass.id)
            .then(() => {
                server.inject(
                    {
                        method: 'GET',
                        credentials: user,
                        url: `/sections/${section.id}/classes`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(400);
                        const response = JSON.parse(res.payload);
                        expect(response.error).to.equal('Bad Request');
                        expect(response.message).to.equal('It appears no classes have been started for this section');
                        done();
                    });
            });
    });

    lab.test('Errors out if section is not found when retrieving the actualClasses', (done) => {

        server.inject(
            {
                method: 'GET',
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

    lab.test('Retrieves a single actual class instance', (done) => {

        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/classes/1`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(section.sequence.actualClass.id);
                expect(response.start_time).to.exist();
                expect(response.stop_time).to.be.null();
                expect(response.reflection).to.be.null();
                expect(response.sequence_id).to.equal(section.sequence.id);
                done();
            });
    });

    lab.test('Errors out not found if cannot find a single actual class instance', (done) => {

        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/classes/100`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Actual Class ID 100 not found!');
                done();
            });
    });

    lab.test('Adds reflection successfully', (done) => {

        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: '/classes/1',
                payload: {
                    reflection: 'abcxyz'
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(section.sequence.actualClass.id);
                expect(response.start_time).to.exist();
                expect(response.stop_time).to.be.null();
                expect(response.reflection).to.startWith('abcxyz');
                expect(response.sequence_id).to.equal(section.sequence.id);
                done();
            });
    });

    lab.test('Mark user_id as present to a class', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/users/${user.id}/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist()
                expect(response.user_id).to.equal(user.id);
                expect(response.actual_class_id).to.equal(section.sequence.actualClass.id);
                expect(response.id).to.exist();
                expect(response.signed_in).to.exist();
                expect(response.signed_out).to.not.exist();
                done();
            });
    });

    lab.test('Mark oneself as present to a class', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/attendance`,
                payload: {
                    code: '000000'
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist()
                expect(response.user_id).to.equal(user.id);
                expect(response.actual_class_id).to.equal(section.sequence.actualClass.id);
                expect(response.id).to.exist();
                expect(response.signed_in).to.exist();
                expect(response.signed_out).to.not.exist();
                done();
            });
    });

    lab.test('Error out if section is not found when giving the user_id when signing in a student', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/100000000/users/${user.id}/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 100000000 was not found!');
                done();
            });
    });

    lab.test('Error out if section is not found when giving user_id when signing out a student', (done) => {

        server.inject(
            {
                method: 'DELETE',
                credentials: user,
                url: `/sections/100000000/users/${user.id}/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 100000000 was not found!');
                done();
            });
    });

    lab.test('Error out if user is not found when giving the user_id when signing in a student', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/users/100000000/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('User ID 100000000 was not found!');
                done();
            });
    });

    lab.test('Error out if user is not found when giving user_id when signing out a student', (done) => {

        server.inject(
            {
                method: 'DELETE',
                credentials: user,
                url: `/sections/${section.id}/users/100000000/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('User ID 100000000 was not found!');
                done();
            });
    });

    lab.test('Error out if section is not found', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/100000000/attendance`,
                payload: {
                    code: '000000'
                }
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
                method: 'DELETE',
                credentials: user,
                url: `/sections/100000000/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 100000000 was not found!');
                done();
            });
    });

    lab.test('Error out on a double sign in to a class', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/attendance`,
                payload: {
                    code: '000000'
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist()
                expect(response.user_id).to.equal(user.id);
                expect(response.actual_class_id).to.equal(section.sequence.actualClass.id);
                expect(response.id).to.exist();
                expect(response.signed_in).to.exist();
                expect(response.signed_out).to.not.exist();
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/sections/${section.id}/attendance`,
                        payload: {
                            code: '000000'
                        }
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(400);
                        const response = JSON.parse(res.payload);
                        expect(response.error).to.equal('Bad Request');
                        expect(response.message).to.equal('You already are listed as present for this class!');
                        done();
                    });
            });
    });

    lab.test('Error out on a double sign in to a class when given the user_id', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/users/${user.id}/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist()
                expect(response.user_id).to.equal(user.id);
                expect(response.actual_class_id).to.equal(section.sequence.actualClass.id);
                expect(response.id).to.exist();
                expect(response.signed_in).to.exist();
                expect(response.signed_out).to.not.exist();
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/sections/${section.id}/users/${user.id}/attendance`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(400);
                        const response = JSON.parse(res.payload);
                        expect(response.error).to.equal('Bad Request');
                        expect(response.message).to.equal(`${user.id} is already listed as present for this class!`);
                        done();
                    });
            });
    });

    lab.test('Error out with wrong code', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/attendance`,
                payload: {
                    code: '000111'
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal('Your attendance code is invalid!');
                done();
            });
    });

    lab.test('Error out class not in session', (done) => {

        ActualClass
            .query()
            .deleteById(section.sequence.actualClass.id)
            .then(() => {
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/sections/${section.id}/attendance`,
                        payload: {
                            code: '000000'
                        }
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(400);
                        const response = JSON.parse(res.payload);
                        expect(response.error).to.equal('Bad Request');
                        expect(response.message).to.equal('Your professor has not started class yet!');
                        done();
                    });
            });
    });

    lab.test('Error out class not in session when providing a user_id', (done) => {

        ActualClass
            .query()
            .deleteById(section.sequence.actualClass.id)
            .then(() => {
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/sections/${section.id}/users/${user.id}/attendance`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(400);
                        const response = JSON.parse(res.payload);
                        expect(response.error).to.equal('Bad Request');
                        expect(response.message).to.equal('The professor has not started class yet!');
                        done();
                    });
            });
    });

    lab.test('Error out class already ended', (done) => {

        ActualClass
            .query()
            .deleteById(section.sequence.actualClass.id)
            .then(() => {
                server.inject(
                    {
                        method: 'DELETE',
                        credentials: user,
                        url: `/sections/${section.id}/attendance`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(400);
                        const response = JSON.parse(res.payload);
                        expect(response.error).to.equal('Bad Request');
                        expect(response.message).to.equal('Class has already ended!');
                        done();
                    });
            });
    });

    lab.test('Error out class already ended when providing a user_id', (done) => {

        ActualClass
            .query()
            .deleteById(section.sequence.actualClass.id)
            .then(() => {
                server.inject(
                    {
                        method: 'DELETE',
                        credentials: user,
                        url: `/sections/${section.id}/users/${user.id}/attendance`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(400);
                        const response = JSON.parse(res.payload);
                        expect(response.error).to.equal('Bad Request');
                        expect(response.message).to.equal('Class has already ended!');
                        done();
                    });
            });
    });

    lab.test('Mark oneself as signed_out from a class successfully', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/attendance`,
                payload: {
                    code: '000000'
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist()
                expect(response.user_id).to.equal(user.id);
                expect(response.actual_class_id).to.equal(section.sequence.actualClass.id);
                expect(response.id).to.exist();
                expect(response.signed_in).to.exist();
                expect(response.signed_out).to.not.exist();

                server.inject(
                    {
                        method: 'DELETE',
                        credentials: user,
                        url: `/sections/${section.id}/attendance`
                    },
                    (res2) => {
                        expect(res2.statusCode).to.equal(200);
                        const response = JSON.parse(res2.payload);
                        expect(response.id).to.exist()
                        expect(response.user_id).to.equal(user.id);
                        expect(response.actual_class_id).to.equal(section.sequence.actualClass.id);
                        expect(response.id).to.exist();
                        expect(response.signed_in).to.exist();
                        expect(response.signed_out).to.exist();
                        done();
                    });
            });
    });

    lab.test('Mark user_id as signed_out from a class successfully', (done) => {

        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${section.id}/users/${user.id}/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist()
                expect(response.user_id).to.equal(user.id);
                expect(response.actual_class_id).to.equal(section.sequence.actualClass.id);
                expect(response.id).to.exist();
                expect(response.signed_in).to.exist();
                expect(response.signed_out).to.not.exist();

                server.inject(
                    {
                        method: 'DELETE',
                        credentials: user,
                        url: `/sections/${section.id}/users/${user.id}/attendance`
                    },
                    (res2) => {
                        expect(res2.statusCode).to.equal(200);
                        const response = JSON.parse(res2.payload);
                        expect(response.id).to.exist()
                        expect(response.user_id).to.equal(user.id);
                        expect(response.actual_class_id).to.equal(section.sequence.actualClass.id);
                        expect(response.id).to.exist();
                        expect(response.signed_in).to.exist();
                        expect(response.signed_out).to.exist();
                        done();
                    });
            });
    });

    lab.test('Error out if you are not marked as present', (done) => {

        server.inject(
            {
                method: 'DELETE',
                credentials: user,
                url: `/sections/${section.id}/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal('You are not marked as present for this class!');
                done();
            });
    });

    lab.test('Error out if the user_id was not marked as present', (done) => {

        server.inject(
            {
                method: 'DELETE',
                credentials: user,
                url: `/sections/${section.id}/users/${user.id}/attendance`
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal(`${user.id} is not marked as present for this class!`);
                done();
            });
    });
});