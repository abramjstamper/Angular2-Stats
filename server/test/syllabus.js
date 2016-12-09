'use strict';

import { init_test, expect, server, db } from './support';
const lab = exports.lab = init_test();

const User = require('../models/User');
const RelationshipType = require('../models/RelationshipType');
const UserSection = require('../models/UserSection');
const UserOffering = require('../models/UserOffering');

lab.experiment('/Syllabus endpoint', () => {

    var studentRelationship = null;
    var user = null;

    lab.beforeEach(done => {

        return Promise.all([
            db.knex.raw(
                'TRUNCATE public.department CASCADE; ' +
                'TRUNCATE public.prefix CASCADE; ' +
                'TRUNCATE public.user CASCADE; ' +
                'TRUNCATE public.term CASCADE; ' +
                'TRUNCATE public.relationship_type CASCADE; ' +
                'TRUNCATE public.learning_outcome CASCADE; ' +
                'TRUNCATE public.knowledge_area CASCADE; '
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
                                '#id': 'this_offering',
                                learningOutcomes: {
                                    offerings: {
                                        '#ref': 'this_offering'
                                    },
                                    title: 'For loops',
                                    description: 'expect to learn for loops',
                                    knowledgeAreas: {
                                        title: 'c++',
                                        description: 'expect to learn c++'
                                    }
                                },
                            }
                        })
                ]).then(results => {
                    user = results[0];
                });
            });
    });

    // No need to invoke done();  According to documentation,
    // you can return a promise instead.

    lab.test('List all outcomes for an offering successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/offerings/${user.offering.id}/outcomes`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(user.offering.id);
                expect(response.title).to.equal(user.offering.title);
                expect(response.course_id).to.equal(user.offering.course_id);
                expect(response.learningOutcomes).to.be.instanceOf(Array);
                expect(response.learningOutcomes).to.have.length(1);
                expect(response.learningOutcomes[0].id).to.equal(user.offering.learningOutcomes.id);
                expect(response.learningOutcomes[0].title).to.equal(user.offering.learningOutcomes.title);
                done();
            });
    });

    lab.test('Get a single outcome', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/offerings/${user.offering.id}/outcomes/${user.offering.learningOutcomes.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(user.offering.learningOutcomes.id);
                expect(response.title).to.equal(user.offering.learningOutcomes.title);
                expect(response.description).to.equal(user.offering.learningOutcomes.description);
                expect(response.knowledge_area_id).to.equal(user.offering.learningOutcomes.knowledge_area_id);
                expect(response.knowledgeAreas).to.exist();
                expect(response.offerings).to.exist();
                done();
            });
    });

    lab.test('Error out when a offering_id does not exist when retreiving a single learning outcome', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/offerings/1000000000/outcomes/${user.offering.learningOutcomes.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Offering ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a learning_outcome_id does not exist when retreiving a single learning outcome', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/offerings/${user.offering.id}/outcomes/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Learning Outcome ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Create a new outcome successfully', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/offerings/${user.offering.id}/outcomes`,
                payload: {
                    title: 'new outcome',
                    description: 'new outcome desc',
                    knowledge_area_id: user.offering.learningOutcomes.knowledgeAreas.id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.title).to.equal('new outcome');
                expect(response.description).to.equal('new outcome desc');
                expect(response.knowledge_area_id).to.equal(user.offering.learningOutcomes.knowledgeAreas.id);
                done();
            });
    });

    lab.test('Error out when a offering_id does not exist when creating a new learning outcome', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/offerings/1000000000/outcomes`,
                payload: {
                    title: 'new outcome',
                    description: 'new outcome desc',
                    knowledge_area_id: user.offering.learningOutcomes.knowledgeAreas.id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Offering ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a knowledge_area_id does not exist when creating a new learning outcome', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/offerings/${user.offering.id}/outcomes`,
                payload: {
                    title: 'new outcome',
                    description: 'new outcome desc',
                    knowledge_area_id: 1000000000
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Knowledge Area ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Updates a learning outcome successfully', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/offerings/${user.offering.id}/outcomes/${user.offering.learningOutcomes.id}`,
                payload: {
                    title: 'edited outcome',
                    description: 'edited outcome desc',
                    knowledge_area_id: user.offering.learningOutcomes.knowledgeAreas.id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(user.offering.learningOutcomes.id);
                expect(response.title).to.equal('edited outcome');
                expect(response.description).to.equal('edited outcome desc');
                expect(response.knowledge_area_id).to.equal(user.offering.learningOutcomes.knowledgeAreas.id);
                done();
            });
    });

    lab.test('Error out when a offering_id does not exist when updating a single outcome', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/offerings/1000000000/outcomes/${user.offering.learningOutcomes.id}`,
                payload: {
                    title: 'edited outcome',
                    description: 'edited outcome desc',
                    knowledge_area_id: user.offering.learningOutcomes.knowledgeAreas.id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Offering ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a learning_outcome_id does not exist when updating a single outcome', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/offerings/${user.offering.id}/outcomes/1000000000`,
                payload: {
                    title: 'edited outcome',
                    description: 'edited outcome desc',
                    knowledge_area_id: user.offering.learningOutcomes.knowledgeAreas.id
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Learning Outcome ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Error out when a knowledge_area_id does not exist when updating a single outcome', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/offerings/${user.offering.id}/outcomes/${user.offering.learningOutcomes.id}`,
                payload: {
                    title: 'edited outcome',
                    description: 'edited outcome desc',
                    knowledge_area_id: 1000000000
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Knowledge Area ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('List all knowledge areas successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/knowledgearea`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                expect(response[0].id).to.equal(user.offering.learningOutcomes.knowledgeAreas.id);
                expect(response[0].title).to.equal(user.offering.learningOutcomes.knowledgeAreas.title);
                expect(response[0].description).to.equal(user.offering.learningOutcomes.knowledgeAreas.description);
                done();
            });
    });

    lab.test('Get a single knowledge area', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/knowledgearea/${user.offering.learningOutcomes.knowledgeAreas.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(user.offering.learningOutcomes.knowledgeAreas.id);
                expect(response.title).to.equal(user.offering.learningOutcomes.knowledgeAreas.title);
                expect(response.description).to.equal(user.offering.learningOutcomes.knowledgeAreas.description);
                done();
            });
    });

    lab.test('Error out when a knowledge_area_id does not exist when retreiving a single knowledge area', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/knowledgearea/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Knowledge Area ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Create a new knowledge area successfully', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/knowledgearea`,
                payload: {
                    title: 'new knowledge area',
                    description: 'my new knowledge area',
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.title).to.equal('new knowledge area');
                expect(response.description).to.equal('my new knowledge area');
                done();
            });
    });

    lab.test('Updates a knowledge area successfully', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/knowledgearea/${user.offering.learningOutcomes.knowledgeAreas.id}`,
                payload: {
                    title: 'edited knowledge area',
                    description: 'edited knowledge area description',
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.id).to.equal(user.offering.learningOutcomes.knowledgeAreas.id);
                expect(response.title).to.equal('edited knowledge area');
                expect(response.description).to.equal('edited knowledge area description');
                done();
            });
    });


});