'use strict';

import { init_test, expect, server, db } from './support';
const lab = exports.lab = init_test();

const User = require('../models/User');
const Prefix = require('../models/Prefix');

lab.experiment('/Department endpoint', () => {

    var prefix = null;
    var user = {
        id: 1,
        first_name: "Sammy",
        last_name: "Morris",
        email: 'sam@example.com',
        mobile_phone: '0123456789',
        office_phone: '0123456789'
    }

    lab.beforeEach(done => {

        return Promise.all([
            db.knex.raw('TRUNCATE public.department CASCADE; ' + 
            'TRUNCATE public.prefix CASCADE; '
            )
        ])
            .then(results => {
                return Promise.all([
                    Prefix
                        .query()
                        .insertWithRelated([
                            {
                                name: 'COS',
                                department: {
                                    name: 'Computer Science & Engineering'
                                },
                            },
                            {
                                name: 'BIB',
                                department: {
                                    '#id': 'bisecp',
                                    name: 'Biblical Studies, Christian Education, & Philosophy'
                                }
                            },
                            {
                                name: 'REL',
                                department: {
                                    '#ref': 'bisecp'
                                }
                            },
                            {
                                name: 'PHI'
                            }
                        ])
                ])
            }).then(results => {
                prefix = results[0];
            });
    });

    // No need to invoke done();  According to documentation,
    // you can return a promise instead.

    lab.test('List all prefixes successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/prefixes`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(4);
                expect(response[0].id).to.equal(prefix[0].id);
                expect(response[0].name).to.equal(prefix[0].name);
                done();
            });
    });

    lab.test('Get a single prefix successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/prefixes/${prefix[0].id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(prefix[0].id);
                expect(response.name).to.equal(prefix[0].name);
                done();
            });
    });

    lab.test('Error out when a term_id does not exist when retreiving a single term', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/prefixes/1000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Prefix ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Create a new prefix successfully', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/prefixes`,
                payload: {
                    name: 'new'
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.name).to.equal('new');
                done();
            });
    });

    lab.test('Updates a prefix successfully', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/prefixes/${prefix[0].id}`,
                payload: {
                    name: 'EDT'
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.id).to.equal(prefix[0].id);
                expect(response.name).to.equal('EDT');
                done();
            });
    });

    lab.test('List all departments successfully', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/departments`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response).to.be.instanceOf(Array);
                expect(response).to.have.length(2);
                expect(response[0].id).to.equal(prefix[0].department.id);
                expect(response[0].name).to.equal(prefix[0].department.name);
                done();
            });
    });

    lab.test('Get a single department', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/departments/${prefix[0].department.id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(prefix[0].department.id);
                expect(response.name).to.equal(prefix[0].department.name);
                done();
            });
    });

    lab.test('Error out when a department_id does not exist when retreiving a single department', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: '/departments/1000000000'
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Department ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Get a single department\'s prefixes', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: `/departments/${prefix[1].department.id}/prefixes`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(prefix[1].department.id);
                expect(response.name).to.equal(prefix[1].department.name);
                expect(response.prefix).to.be.instanceOf(Array);
                expect(response.prefix).to.have.length(2);
                expect(response.prefix[0].id).to.equal(prefix[1].id);
                expect(response.prefix[0].name).to.equal(prefix[1].name);
                done();
            });
    });

    lab.test('Error out when a department_id does not exist when retreiving a department\'s prefixes', (done) => {
        server.inject(
            {
                method: 'GET',
                credentials: user,
                url: '/departments/1000000000/prefixes'
            },
            (res) => {
                expect(res.statusCode).to.equal(404);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Not Found');
                expect(response.message).to.equal('Department ID 1000000000 was not found!');
                done();
            });
    });

    lab.test('Associate a department_id with a prefix_id successfully', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/departments/${prefix[1].department.id}/prefixes/${prefix[3].id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.equal(prefix[1].department.id);
                expect(response.name).to.equal(prefix[1].department.name);
                expect(response.prefix).to.be.instanceOf(Array);
                expect(response.prefix).to.have.length(3);
                expect(response.prefix[0].id).to.equal(prefix[1].id);
                expect(response.prefix[0].name).to.equal(prefix[1].name);
                expect(response.prefix[2].id).to.equal(prefix[3].id);
                expect(response.prefix[2].name).to.equal(prefix[3].name);
                done();
            });
    });

    lab.test('Error out when a department_id attempts to associate with an invalid prefix_id', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: '/departments/1000000000/prefixes/2000000000'
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal('Could not associate department ID 1000000000 with prefix ID 2000000000');
                done();
            });
    });

    lab.test('Error out when an invalid department_id attempts to associate with an invalid prefix_id', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/departments/${prefix[1].department.id}/prefixes/2000000000`
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal(`Could not associate department ID ${prefix[1].department.id} with prefix ID 2000000000`);
                done();
            });
    });

    lab.test('Error out when a valid department_id attempts to associate with an valid prefix_id', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/departments/1000000000/prefixes/${prefix[1].id}`
            },
            (res) => {
                expect(res.statusCode).to.equal(400);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Bad Request');
                expect(response.message).to.equal(`Could not associate department ID 1000000000 with prefix ID ${prefix[1].id}`);
                done();
            });
    });  

    lab.test('Create a new department successfully', (done) => {
        server.inject(
            {
                method: 'POST',
                credentials: user,
                url: `/departments`,
                payload: {
                    name: 'new department',
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.name).to.equal('new department');
                done();
            });
    });

    lab.test('Updates a department successfully', (done) => {
        server.inject(
            {
                method: 'PUT',
                credentials: user,
                url: `/departments/${prefix[0].department.id}`,
                payload: {
                    name: 'edited department',
                }
            },
            (res) => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.id).to.exist();
                expect(response.id).to.equal(prefix[0].department.id);
                expect(response.name).to.equal('edited department');
                done();
            });
    });
});
