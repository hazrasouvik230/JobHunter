const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: [String],
    jobType: String,
    requirements: [String],
    experienceLevel: String,
    salary: String,
    deadline: Date,
    description: String,
    interviewQuestions: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;