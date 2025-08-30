const Joi = require("joi");

const userRegisterValidationSchema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().required().email().trim(),
    password: Joi.string().required().trim().min(8).pattern(new RegExp(`(?=.*[a-z])`)).pattern(new RegExp(`(?=.*[A-Z])`)).pattern(new RegExp(`(?=.*\\d)`)).pattern(new RegExp(`(?=.*[!@#$%^&*])`)),
    role: Joi.string().valid("User", "HR").default("User"),
    companyName: Joi.when("role", {
        is: "HR",
        then: Joi.string().required().trim(),
        otherwise: Joi.optional()
    })
});

const userLoginValidationSchema = Joi.object({
    email: Joi.string().required().email().trim(),
    password: Joi.string().required().trim().min(8).pattern(new RegExp(`(?=.*[a-z])`)).pattern(new RegExp(`(?=.*[A-Z])`)).pattern(new RegExp(`(?=.*\\d)`)).pattern(new RegExp(`(?=.*[!@#$%^&*])`))
});

module.exports = { userRegisterValidationSchema, userLoginValidationSchema };