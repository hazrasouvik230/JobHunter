const Joi = require("joi");

const subscriptionValidationModel = Joi.object({
    planName: Joi.string().valid("Free", "Basic", "Professional", "Enterprise").default("Free"),
    jobPostsLimit: Joi.number().default(3),
    jobPostsUsed: Joi.number().default(0),
    startDate: Joi.date().default(() => new Date(), "current date"),
    endDate: Joi.date().allow(null).default(null),
    isActive: Joi.boolean().default(true),
    // price: Joi.number().default(0),
    // paymentStatus: Joi.string().valid("pending", "completed", "failed", "free").default("free")
});

module.exports = subscriptionValidationModel;