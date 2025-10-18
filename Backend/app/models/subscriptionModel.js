const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    planName: String,
    jobPostsLimit: Number,
    jobPostsUsed: Number,
    startDate: Date,
    endDate: Date,
    isActive: Boolean,
    paymentId: String,
    razorpayOrderId: String,
    amountPaid: Number,
    currency: {
        type: String,
        default: "INR"
    }
}, { timestamps: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;