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
    shortDesc: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    companyName: String,
    companyLogo: String,
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;