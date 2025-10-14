const crypto = require("crypto");

const Interview = require("../models/interviewModel");

const interviewController = {};

const generateMeetingLink = () => {
    return crypto.randomBytes(16).toString("hex");
};

interviewController.scheduleInterview = async (req, res) => {
    try {
        const { jobId, applicantId, date, startTime, endTime, status, rating } = req.body;
        const hrId = req.userId;

        const meetingLink = generateMeetingLink();

        const interview = new Interview({ jobId, applicantId, hrId, date, startTime, endTime, status, meetingLink, rating });
        await interview.save();

        res.status(201).json({ success: true, message: "Interview scheduled successfully.", interview });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

interviewController.getInterviewByApplicant = async (req, res) => {
    try {
        const applicantId = req.userId;
        const interviews = await Interview.find({ applicantId }).populate("hrId", ["name", "companyName", "companyLogo"]).populate("jobId", ["title"]);
        res.status(200).json({ success: true, message: "Interviews fetched successfully!", interviews });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

interviewController.getInterviewByHR = async (req, res) => {
    try {
        const hrId = req.userId;
        const interviews = await Interview.find({ hrId }).populate("applicantId", ["name", "email"]).populate("jobId", ["title"]);
        res.status(200).json({ success: true, message: "Interviews fetched successfully!", interviews });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

interviewController.specificInterview = async (req, res) => {
    const { meetingLink } = req.params;

    try {
        const interview = await Interview.findOne({ meetingLink }).populate("applicantId", [""]).populate("hrId", ["name", "companyName"]).populate("jobId", ["title"]);
        res.status(200).json({ message: "Interview fetched successfully!", interview });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
}

module.exports = interviewController;