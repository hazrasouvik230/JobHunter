const Joi = require("joi");

const jobValidationSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.array().items(Joi.string()).default([]),
    jobType: Joi.string().valid("Full-Time", "Part-Time", "Internship", "Contract", "Remote").required(),
    requirements: Joi.array().items(Joi.string()).default([]),
    experienceLevel: Joi.string().required(),
    salary: Joi.number().required(),
    deadline: Joi.date().greater("now").required(),
    description: Joi.string().allow("")
});

module.exports = jobValidationSchema;