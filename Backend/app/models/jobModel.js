const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: String,
    location: [String],
    jobType: String,
    requirements: [String],
    experienceLevel: String,
    salary: Number,
    deadline: Date,
    description: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    companyName: String,
    companyLogo: String,
    applicants: [{
        applicantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["applied", "rejected", "selected_for_interview", "hired"],
            default: "applied"
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;