'use strict';

import { init_test, expect, server, db } from './support';
const lab = exports.lab = init_test();

const User = require('../models/User');
const Section = require('../models/Section');
const ActualClass = require('../models/ActualClass');

lab.experiment('/Catalog endpoint', () => {

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
                            },
                            sectionSchedule: [{
                                weekday: 'Monday',
                                start_time: '3:00 PM',
                                stop_time: '3:50 PM'
                            },
                                {
                                    weekday: 'Friday',
                                    start_time: '4:00 PM',
                                    stop_time: '4:50 PM'
                                }]
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

    lab.test('List all courses successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/courses`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                expect(response[0].id).to.equal(section.course.id);
                expect(response[0].title).to.equal(section.course.title);
                expect(response[0].number).to.equal(section.course.number);
                expect(response[0].prefix.id).to.equal(section.course.prefix_id);
                expect(response[0].department.id).to.equal(section.course.department_id);
                expect(response[0].section).to.be.instanceOf(Array);
                expect(response[0].section).to.have.length(1);
                expect(response[0].section[0].sectionSchedule).to.be.instanceOf(Array);
                expect(response[0].section[0].sectionSchedule).to.have.length(2);
                expect(response[0].section[0].sectionSchedule[0].weekday).to.equal(section.sectionSchedule[0].weekday);
                done();
            });
    });

    lab.test('Get a single course', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/courses/${section.course.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(section.course.id);
                expect(response.title).to.equal(section.course.title);
                expect(response.number).to.equal(section.course.number);
                expect(response.prefix.id).to.equal(section.course.prefix_id);
                expect(response.department.id).to.equal(section.course.department_id);
                expect(response.section).to.be.instanceOf(Array);
                expect(response.section).to.have.length(1);
                expect(response.section[0].sectionSchedule).to.be.instanceOf(Array);
                expect(response.section[0].sectionSchedule).to.have.length(2);
                expect(response.section[0].sectionSchedule[0].weekday).to.equal(section.sectionSchedule[0].weekday);
                done();
            });
    });

    lab.test('Error out when a course_id does not exist when retreiving a single course', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/courses/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Course ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Create a new course successfully', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/courses`,
                payload: {
                    title: 'new course',
                    number: '100',
                    hidden: true,
                    prefix_id: section.course.prefix_id,
                    department_id: section.course.department_id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.title).to.equal('new course');
                expect(response.number).to.equal('100');
                expect(response.prefix_id).to.equal(section.course.prefix_id);
                expect(response.department_id).to.equal(section.course.department_id);
                done();
            });
    });

    lab.test('Updates a course successfully', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/courses/${section.course.id}`,
                payload: {
                    title: 'edited course',
                    number: '400',
                    hidden: true,
                    prefix_id: section.course.prefix_id,
                    department_id: section.course.department_id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.title).to.equal('edited course');
                expect(response.number).to.equal('400');
                expect(response.hidden).to.be.true();
                expect(response.prefix_id).to.equal(section.course.prefix_id);
                expect(response.department_id).to.equal(section.course.department_id);
                done();
            });
    });

    lab.test('Gets the sections and schedule for a course_id', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/courses/${section.course.id}/sections`,
                payload: {
                    title: 'edited course',
                    number: '400',
                    hidden: true,
                    prefix_id: section.course.prefix_id,
                    department_id: section.course.department_id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                expect(response[0].sectionSchedule).to.be.instanceOf(Array);
                expect(response[0].sectionSchedule).to.have.length(2);
                expect(response[0].sectionSchedule[0].weekday).to.equal(section.sectionSchedule[0].weekday);
                done();
            });
    });
});
