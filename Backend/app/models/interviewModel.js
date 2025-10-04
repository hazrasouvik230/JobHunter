const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    hrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled", "rejected"],
        default: "scheduled"
    },
    meetingLink: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;