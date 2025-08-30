const Joi = require("joi");

const jobValidationSchema = Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.array().items(Joi.string()).default([]),
    jobType: Joi.string().valid("Full-Time", "Part-Time", "Internship", "Contract", "Remote").required(),
    requirements: Joi.array().items(Joi.string()).default([]),
    salary: Joi.string().required(),
    experienceLevel: Joi.string().required(),
    deadline: Joi.date().greater("now").required(),
    description: Joi.string().allow("")
});

module.exports = jobValidationSchema;