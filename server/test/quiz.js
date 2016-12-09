'use strict';

import {init_test, expect, server, db} from './support';
const lab = exports.lab = init_test();

const Activity = require('../models/Activity');

lab.experiment('Quiz', () => {

    lab.beforeEach(done => {
        return db.knex.raw('TRUNCATE public.activity CASCADE')
            .then(result => {
                return Activity
                    .query()
                    .insertWithRelated({
                        sequence: 1,
                        description: 'One question quiz',
                        in_class: true,
                        duration: 5,
                        details: {
                            "title": "All About Our Favorite Metal",
                            "questions": [
                                {
                                    "question": "What is the atomic weight of Selenium?",
                                    "answers": [
                                        {
                                            "correct": true,
                                            "answer": "78.96",
                                            "feedback": "Right!"
                                        },
                                        {
                                            "correct": false,
                                            "answer": "71",
                                            "feedback": "Sorry; too low"
                                        },
                                        {
                                            "correct": false,
                                            "answer": "83.44",
                                            "feedback": "Sorry; too high"
                                        }
                                    ]
                                }
                            ]
                        },

                        topic: {
                            title: 'All About Metal',
                            description: 'Learn about metals',

                            offering: {
                                title: 'Renaissance Metal',

                                course: {
                                    number: '123',
                                    title: 'Metal Through the Ages',
                                    prefix: {
                                        name: 'METAL'
                                    },
                                    department: {
                                        name: 'Metallurgy'
                                    }
                                }
                            }
                        }
                    })
                    .catch(err => {
                        console.log('ERROR', err);
                    })
            })
    });

    lab.test("There's an activity in the database", done => {
        server.inject(
            {
                method: 'GET',
                url: '/activities',
                credentials: {}
            }, res => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(1);
                done();
            });
    });

});