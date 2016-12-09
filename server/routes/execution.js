const Boom = require('boom');
const Joi = require('joi');

const Section = require('../models/Section');
const ActualClass = require('../models/ActualClass');
const attendance_code_length = require('../plugins/codeGenerator').attendance_code_length;

exports.register = function (server, options, next) {

    server.route({
        method: 'POST',
        path: '/sections/{section_id}/classes',
        handler: function (request, reply) {
            //Get the sequence ID
            Section
                .query()
                .where('id', request.params.section_id)
                .eager('sequence')
                .first()
                .then((section) => {
                    //Checks to make sure the section exists
                    if (section != null) {
                        section
                            .sequence
                            .$relatedQuery('actualClass')
                            .where('stop_time', null)
                            .first()
                            .then((existingActualClass) => {
                                //checks to make sure that the professor hasn't already started class
                                if (existingActualClass == null) {
                                    //create code                                    
                                    server.methods.attendance.classBegin(section.sequence.id, (err, result) => {
                                        if (!err) {
                                            //create actual class instance
                                            section
                                                .sequence
                                                .$relatedQuery('actualClass')
                                                .insert({
                                                    start_time: new Date(),
                                                    sequence_id: section.sequence.id
                                                }).then((actualClass) => {
                                                    actualClass.code = result;
                                                    reply(actualClass);
                                                });
                                        } else {
                                            return reply(Boom.badImplementation(err));
                                        }
                                    });
                                } else {
                                    reply(Boom.badRequest('Class is already in session!'));
                                }
                            });
                    } else {
                        reply(Boom.notFound('Section ID ' + request.params.section_id + ' was not found!'));
                    }
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'Allows a professor to start class',
            validate: {
                params: {
                    section_id: Joi.number().positive().integer()
                }
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/sections/{section_id}/classes',
        handler: function (request, reply) {
            //Get the sequence ID
            Section
                .query()
                .where('id', request.params.section_id)
                .eager('sequence')
                .first()
                .then((section) => {
                    //Checks to make sure the section exists
                    if (section != null) {
                        section
                            .sequence
                            .$relatedQuery('actualClass')
                            .where('stop_time', null)
                            .first()
                            .then((existingActualClass) => {
                                //checks to make sure that the professor has already started class
                                if (existingActualClass != null) {
                                    server.methods.attendance.classOver(section.sequence.id, (err, result) => {
                                        if (!err) {
                                            section
                                                .sequence
                                                .$relatedQuery('actualClass')
                                                .patchAndFetchById(existingActualClass.id, {
                                                    stop_time: new Date()
                                                }).then((actualClass) => {
                                                    reply(actualClass);
                                                });
                                        } else {
                                            reply(Boom.badImplementation(err));
                                        }
                                    });
                                } else {
                                    reply(Boom.badRequest('Class has not been started or has already ended for the day!'));
                                }
                            });
                    } else {
                        reply(Boom.notFound('Section ID ' + request.params.section_id + ' was not found!'));
                    }
                })
                .catch((err) => {
                    reply(Boom.badImplementation(err));
                });
        },
        config: {
            notes: 'Allows a professor to end class',
            validate: {
                params: {
                    section_id: Joi.number().positive().integer()
                }
            }
        }
    });

    next();
};

exports.register.attributes = { name: 'execution', version: '0.0.4' };