const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
    boardName: String,
    instituteName: String,
    streamName: String,
    marks: Number,
    passout: Date
});

const experienceSchema = new mongoose.Schema({
    companyName: String,
    companyLogo: String,
    designationName: String,
    remarks: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean
});

const projectSchema = new mongoose.Schema({
    projectTitle: String,
    remarks: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean
});

const certificateSchema = new mongoose.Schema({
    certificateName: String,
    refURL: String,
    remarks: String,
    startDate: Date,
    endDate: Date
});

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: String,
    email: String,
    mobile: String,
    address: String,
    title: String,
    description: String,
    technicalSkills: [String],
    softSkills: [String],
    languages: [String],
    interests: [String],
    educations: [educationSchema],
    experiences: [experienceSchema],
    projects: [projectSchema],
    certificates: [certificateSchema]
}, { timestamps: true });

const Resume = mongoose.model("Resume", resumeSchema);
module.exports = Resume;