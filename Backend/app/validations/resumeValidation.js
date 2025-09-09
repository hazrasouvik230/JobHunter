const Joi = require("joi");

const educationValidationSchema = Joi.object({
    boardName: Joi.string().trim().required(),
    instituteName: Joi.string().trim().required(),
    streamName: Joi.string().trim().required(),
    marks: Joi.number().min(0).max(100).required(),
    passout: Joi.date().required()
});

const experienceValidationSchema = Joi.object({
    companyName: Joi.string().trim().required(),
    companyLogo: Joi.string().trim().required(),
    designationName: Joi.string().trim().required(),
    remarks: Joi.string().trim().allow("").required(),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
    currentlyWorking: Joi.boolean()
});

const projectValidationSchema = Joi.object({
    projectTitle: Joi.string().trim().required(),
    remarks: Joi.string().trim().allow("").required(),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
    currentlyWorking: Joi.boolean()
});

const certificateValidationSchema = Joi.object({
    certificateName: Joi.string().trim().required(),
    refURL: Joi.string().uri().allow(""),
    remarks: Joi.string().allow(""),
    startDate: Joi.date().required(),
    endDate: Joi.date().required()
});

const resumeValidationSchema = Joi.object({
    mobile: Joi.string().pattern(/^[0-9]{10}$/).trim().required(),
    address: Joi.string().trim().required(),
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    technicalSkills: Joi.array().items(Joi.string()).optional(),
    softSkills: Joi.array().items(Joi.string()).optional(),
    languages: Joi.array().items(Joi.string()).optional(),
    interests: Joi.array().items(Joi.string()).optional(),
    educations: Joi.array().items(educationValidationSchema).optional(),
    experiences: Joi.array().items(experienceValidationSchema).optional(),
    projects: Joi.array().items(projectValidationSchema).optional(),
    certificates: Joi.array().items(certificateValidationSchema).optional(),
});

module.exports = { educationValidationSchema, experienceValidationSchema, projectValidationSchema, certificateValidationSchema, resumeValidationSchema };