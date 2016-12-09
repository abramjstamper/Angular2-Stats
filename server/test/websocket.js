'use strict';

import { init_test, expect, server } from './support';
const lab = exports.lab = init_test();

var user = {
    id: 1,
    first_name: "Sammy",
    last_name: "Morris",
    email: 'sam@example.com',
    mobile_phone: '0123456789',
    office_phone: '0123456789',
    password: 'pass'
};

lab.experiment('web sockets', () => {

    lab.test('are authenticating successfully', done => {
        server.inject(
            {
                method: 'GET',
                url: '/nes/auth',
                credentials: user,
            }, res => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.status).to.equal('authenticated');
                done();
            }
        )
    });

    lab.test('error out on unauthenticated user', done => {
        server.inject(
            {
                method: 'GET',
                url: '/nes/auth',
            }, res => {
                expect(res.statusCode).to.equal(401);
                const response = JSON.parse(res.payload);
                expect(response.error).to.equal('Unauthorized');
                expect(response.message).to.equal('Missing authentication');
                done();
            }
        )
    });

    lab.test('are connecting successfully', done => {
        server.inject(
            {
                method: 'GET',
                url: '/nes/auth',
                credentials: user,
            }, res => {
                expect(res.statusCode).to.equal(200);
                const response = JSON.parse(res.payload);
                expect(response.status).to.equal('authenticated');

                server.inject(
                    {
                        method: 'GET',
                        url: '/hello',
                        credentials: user,
                    }, res => {
                        expect(res.payload).to.startWith('This is a confirmation');
                        done();
                    }
                )
            }
        )
    });

});
