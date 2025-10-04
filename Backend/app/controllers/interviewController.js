const Interview = require("../models/interviewModel");

const interviewController = {};

interviewController.scheduleInterview = async (req, res) => {
    try {
        const { jobId, applicantId, date, startTime, endTime, status, meetingLink, rating } = req.body;
        const hrId = req.userId;

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

module.exports = interviewController;