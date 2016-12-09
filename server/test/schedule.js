'use strict';

import { init_test, expect, server, db } from './support';
const lab = exports.lab = init_test();

const User = require('../models/User');
const RelationshipType = require('../models/RelationshipType');
const UserSection = require('../models/UserSection');
const UserOffering = require('../models/UserOffering');

lab.experiment('/Schedule endpoint', () => {

    var studentRelationship = null;
    var user = null;

    lab.beforeEach(done => {

        return Promise.all([
            db.knex.raw(
                'TRUNCATE public.department CASCADE; ' +
                'TRUNCATE public.prefix CASCADE; ' +
                'TRUNCATE public.user CASCADE; ' +
                'TRUNCATE public.term CASCADE; ' +
                'TRUNCATE public.relationship_type CASCADE; '
            )
        ])
            .then(() => {
                return RelationshipType
                    .query()
                    .insert(
                    {
                        title: 'student',
                        description: 'I am learning'
                    }
                    ).then((relationshipType) => {
                        studentRelationship = relationshipType;
                    })
            })
            .then(results => {
                return Promise.all([
                    User
                        .query()
                        .insertWithRelated({
                            first_name: "Sammy",
                            last_name: "Morris",
                            email: 'sam@example.com',
                            mobile_phone: '0123456789',
                            office_phone: '0123456789',
                            password: 'pass',
                            section: {
                                relationship_type_id: studentRelationship.id,
                                title: 'Section xyz',
                                reg_number: '123456',
                                credit_hours: 3,
                                sequence: {
                                    title: 'seq xyz',
                                    offering: {
                                        '#ref': 'this_offering',
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
                            },
                            offering: {
                                title: 'Offering Title',
                                relationship_type_id: studentRelationship.id,
                                '#id': 'this_offering'
                            }
                        })
                ]).then(results => {
                    user = results[0];
                });
            });
    });

    // No need to invoke done();  According to documentation,
    // you can return a promise instead.

    lab.test('List all terms successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/terms`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                expect(response[0].id).to.equal(user.section.term.id);
                expect(response[0].name).to.equal(user.section.term.name);
                expect(response[0].start_date.substring(0, 10)).to.equal(user.section.term.start_date);
                expect(response[0].end_date.substring(0, 10)).to.equal(user.section.term.end_date);
                done();
            });
    });

    lab.test('Get a single term', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/terms/${user.section.term.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(user.section.term.id);
                expect(response.name).to.equal(user.section.term.name);
                expect(response.start_date.substring(0, 10)).to.equal(user.section.term.start_date);
                expect(response.end_date.substring(0, 10)).to.equal(user.section.term.end_date);
                done();
            });
    });

    lab.test('Error out when a term_id does not exist when retreiving a single term', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/terms/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Term ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Create a new term successfully', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/terms`,
                payload: {
                    name: 'new term',
                    start_date: '2020-01-01',
                    end_date: '2020-05-15',
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.name).to.equal('new term');
                expect(response.start_date.substring(0, 10)).to.equal('2020-01-01');
                expect(response.end_date.substring(0, 10)).to.equal('2020-05-15');
                done();
            });
    });

    lab.test('Updates a term successfully', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/terms/${user.section.term.id}`,
                payload: {
                    name: 'edited term',
                    start_date: '2020-01-01',
                    end_date: '2020-05-15',
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.id).to.equal(user.section.term.id);
                expect(response.name).to.equal('edited term');
                expect(response.start_date.substring(0, 10)).to.equal('2020-01-01');
                expect(response.end_date.substring(0, 10)).to.equal('2020-05-15');
                done();
            });
    });

    lab.test('List all sections successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/sections`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                expect(response[0].id).to.equal(user.section.id);
                expect(response[0].title).to.equal(user.section.title);
                expect(response[0].reg_number).to.equal(user.section.reg_number);
                expect(response[0].credit_hours).to.equal(user.section.credit_hours);
                expect(response[0].sequence.offering.course.id).to.equal(user.section.course.id);
                expect(response[0].sequence.offering.course.prefix.id).to.equal(user.section.course.prefix_id);
                expect(response[0].sequence.offering.course.department.id).to.equal(user.section.course.department_id);
                expect(response[0].sectionSchedule).to.be.instanceOf(Array);
                expect(response[0].sectionSchedule).to.have.length(2);
                expect(response[0].sectionSchedule[0].weekday).to.equal(user.section.sectionSchedule[0].weekday);
                expect(response[0].relationshipType[0].title).to.equal(studentRelationship.title);
                done();
            });
    });

    lab.test('Get a single section', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/sections/${user.section.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(user.section.id);
                expect(response.title).to.equal(user.section.title);
                expect(response.reg_number).to.equal(user.section.reg_number);
                expect(response.credit_hours).to.equal(user.section.credit_hours);
                expect(response.sequence.offering.course.id).to.equal(user.section.course.id);
                expect(response.sequence.offering.course.prefix.id).to.equal(user.section.course.prefix_id);
                expect(response.sequence.offering.course.department.id).to.equal(user.section.course.department_id);
                expect(response.sectionSchedule).to.be.instanceOf(Array);
                expect(response.sectionSchedule).to.have.length(2);
                expect(response.sectionSchedule[0].weekday).to.equal(user.section.sectionSchedule[0].weekday);
                expect(response.relationshipType[0].title).to.equal(studentRelationship.title);
                done();
            });
    });

    lab.test('Error out when a section_id does not exist when retreiving a single section', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: '/sections/1000000000'
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Create a new section successfully', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections`,
                payload: {
                    title: 'new section',
                    reg_number: '012345',
                    credit_hours: 1,
                    term_id: user.section.term.id,
                    course_id: user.section.course.id,
                    sequence_id: user.section.sequence.id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.title).to.equal('new section');
                expect(response.reg_number).to.equal('012345');
                expect(response.credit_hours).to.equal(1);
                expect(response.term_id).to.equal(user.section.term.id);
                expect(response.course_id).to.equal(user.section.course.id);
                expect(response.sequence_id).to.equal(user.section.sequence_id);
                done();
            });
    });

    lab.test('Updates a section successfully', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/sections/${user.section.id}`,
                payload: {
                    title: 'edited section',
                    reg_number: '98765',
                    credit_hours: 1,
                    term_id: user.section.term.id,
                    course_id: user.section.course.id,
                    sequence_id: user.section.sequence.id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.id).to.equal(user.section.id);
                expect(response.title).to.equal('edited section');
                expect(response.reg_number).to.equal('98765');
                expect(response.credit_hours).to.equal(1);
                expect(response.term_id).to.equal(user.section.term.id);
                expect(response.course_id).to.equal(user.section.course.id);
                expect(response.sequence_id).to.equal(user.section.sequence_id);
                done();
            });
    });

    lab.test('Errors out when a students attempts to self enroll in a section twice', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${user.section.id}/enroll`
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal(`You are already enrolled in section ID ${user.section.id}`);
                done();
            });
    });

    lab.test('Successfully allows a user to self assign to a section as a student', (done) => {
        UserSection
            .query()
            .delete()
            .where('user_id', user.id)
            .andWhere('section_id', user.section.id)
            .andWhere('relationship_type_id', studentRelationship.id)
            .then((numDeleted) => {
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/sections/${user.section.id}/enroll`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(200);
                        const response = JSON.parse(res.payload);
                        expect(response.id).to.exist();
                        expect(response.id).to.equal(user.section.id);
                        expect(response.user_id).to.equal(user.id);
                        expect(response.relationship_type_id).to.equal(studentRelationship.id);
                        done();
                    });
            });
    });

    lab.test('Error out when a section_id does not exist when attempting to self enroll in a section', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: '/sections/1000000000/enroll'
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Errors out when a student attempts enroll a user_id in a section twice', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${user.section.id}/users/${user.id}/enroll`
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal(`You are already enrolled in section ID ${user.section.id}`);
                done();
            });
    });

    lab.test('Successfully allows a user to assign a user_id to a section as a student', (done) => {
        UserSection
            .query()
            .delete()
            .where('user_id', user.id)
            .andWhere('section_id', user.section.id)
            .andWhere('relationship_type_id', studentRelationship.id)
            .then((numDeleted) => {
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/sections/${user.section.id}/users/${user.id}/enroll`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(200);
                        const response = JSON.parse(res.payload);
                        expect(response.id).to.exist();
                        expect(response.id).to.equal(user.section.id);
                        expect(response.user_id).to.equal(user.id);
                        expect(response.relationship_type_id).to.equal(studentRelationship.id);
                        done();
                    });
            });
    });

    lab.test('Error out when a section_id does not exist when attempting to enroll a user_id to a section', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/1000000000/users/${user.id}/enroll`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a user_id does not exist when attempting to enroll a user_id to a section', (done) => {
        UserSection
            .query()
            .delete()
            .where('user_id', user.id)
            .andWhere('section_id', user.section.id)
            .andWhere('relationship_type_id', studentRelationship.id)
            .then((numDeleted) => {
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/sections/${user.section.id}/users/1000000000/enroll`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(404);
                        const response = JSON.parse(res.payload);
                        expect(response.error).to.equal('Not Found');
                        expect(response.message).to.equal('User ID 1000000000 was not found!');
                        done();
                    });
            });
    });

    lab.test('Error out when a section_id does not exist when attempting to retreive a list of users for a given section', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/sections/${user.section.id}/relationships/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Relationship Type ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a relationship_type_id does not exist when attempting to retreive a list of users for a given section', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/sections/1000000000/relationships/${studentRelationship.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Retrieve a list of students from the database for a given section successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/sections/${user.section.id}/relationships/${studentRelationship.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                expect(response[0].id).to.equal(user.id);
                expect(response[0].first_name).to.equal(user.first_name);
                expect(response[0].last_name).to.equal(user.last_name);
                expect(response[0].email).to.equal(user.email);
                done();
            });
    });

    lab.test('Error out when a section_id does not exist when attempting associate a user with a section', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${user.section.id}/relationships/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Relationship Type ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a relationship_type_id does not exist when attempting associate a user with a section', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/1000000000/relationships/${studentRelationship.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Section ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a user has already been \'enrolled\' in a section when attempting associate a user with a section', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/sections/${user.section.id}/relationships/${studentRelationship.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal('You are already enrolled in section ID ' + user.section.id);
                done();
            });
    });

    lab.test('associates a user with a section and relationship_type successfully', (done) => {
        UserSection
            .query()
            .delete()
            .where('user_id', user.id)
            .andWhere('section_id', user.section.id)
            .andWhere('relationship_type_id', studentRelationship.id)
            .then((numDeleted) => {
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/sections/${user.section.id}/relationships/${studentRelationship.id}`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(200);
                        const response = JSON.parse(res.payload);
                        expect(response.relationship_type_id).to.equal(studentRelationship.id);
                        expect(response.section_id).to.equal(user.section.id);
                        expect(response.id).to.equal(user.id);
                        done();
                    });
            });
    });

    lab.test('Error out when a offering_id does not exist when attempting associate a user with a offering', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/offerings/${user.section.sequence.offering.id}/relationships/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Relationship Type ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a relationship_type_id does not exist when attempting associate a user with a offering', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/offerings/1000000000/relationships/${studentRelationship.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Offering ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a user has already been \'enrolled\' in an offering when attempting associate a user with a section', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/offerings/${user.section.sequence.offering.id}/relationships/${studentRelationship.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal('You are already enrolled in offering ID ' + user.section.sequence.offering.id);
                done();
            });
    });

    lab.test('associates a user with an offering and relationship_type successfully', (done) => {
        UserOffering
            .query()
            .delete()
            .where('user_id', user.id)
            .andWhere('offering_id', user.section.sequence.offering.id)
            .andWhere('relationship_type_id', studentRelationship.id)
            .then((numDeleted) => {
                server.inject(
                    {
                        method: 'POST',
                        credentials: user,
                        url: `/offerings/${user.section.sequence.offering.id}/relationships/${studentRelationship.id}`
                    },
                    (res) => {
                        expect(res.statusCode).to.equal(200);
                        const response = JSON.parse(res.payload);
                        expect(response.relationship_type_id).to.equal(studentRelationship.id);
                        expect(response.offering_id).to.equal(user.section.sequence.offering.id);
                        expect(response.id).to.equal(user.id);
                        done();
                    });
            });
    });

    lab.test('Error out when a section_id does not exist when attempting to retreive a list of users for a given offering', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/offerings/${user.section.sequence.offering.id}/relationships/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Relationship Type ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a relationship_type_id does not exist when attempting to retreive a list of users for a given offering', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/offerings/1000000000/relationships/${studentRelationship.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Offering ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Retrieve a list of students from the database for a given offering successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/offerings/${user.section.sequence.offering.id}/relationships/${studentRelationship.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                expect(response[0].id).to.equal(user.id);
                expect(response[0].first_name).to.equal(user.first_name);
                expect(response[0].last_name).to.equal(user.last_name);
                expect(response[0].email).to.equal(user.email);
                done();
            });
    });

    lab.test('Retrieves all the relationship_types for sections/offerings succesfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/relationships`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                expect(response[0].id).to.equal(studentRelationship.id);
                expect(response[0].title).to.equal(studentRelationship.title);
                expect(response[0].description).to.equal(studentRelationship.description);
                done();
            });
    });

    lab.test('Retrieves a specific relationship_type successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/relationships/${studentRelationship.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(studentRelationship.id);
                expect(response.title).to.equal(studentRelationship.title);
                expect(response.description).to.equal(studentRelationship.description);
                done();
            });
    });

    lab.test('Errors out when attempting to retrieve a relationship_type_id that does not exist', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/relationships/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Relationship Type ID 1000000000 was not found!');
                done();
            });
    });


});