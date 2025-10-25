const crypto = require("crypto");

const Interview = require("../models/interviewModel");
const Job = require("../models/jobModel");
const generateInterviewFeedback = require("../utils/generateInterviewFeedback");

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

        await Job.updateOne(
            { _id: jobId, "applicants.applicantId": applicantId },
            { $set: { "applicants.$.status": "selected_for_interview" } }
        );

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
        const interviews = await Interview.find({ hrId }).populate("applicantId", ["name", "email"]).populate("jobId", ["title"]).sort({ date: 1 });
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
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found." });
        }

        res.status(200).json({ message: "Interview fetched successfully!", interview });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
};

interviewController.specificJobRejection = async (req, res) => {
    try {
        const { jobId, applicantId } = req.body;

        const job = await Job.findById(jobId);
        if(!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        await Job.updateOne(
            { _id: jobId, "applicants._id": applicantId },
            { $set: { "applicants.$.status": "rejected" } }
        );

        res.status(200).json({ success: true, message: "Candidate response is rejected." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
};

interviewController.completeInterview = async (req, res) => {
    try {
        const { meetingLink } = req.params;
        const { jobId, applicantId, status, conversationTranscript } = req.body;

        const interview = await Interview.findOne({ meetingLink });
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found." });
        }

        interview.status = status || "completed";

        if (conversationTranscript && conversationTranscript.interviewer && conversationTranscript.candidate) {
            try {
                const aiFeedback = await generateInterviewFeedback(conversationTranscript);

                const ratingMatch = aiFeedback.match(/\b(\d+)\/10\b/);
                if (ratingMatch) {
                    interview.rating = parseInt(ratingMatch[1]);
                    // interview.numericRating = parseInt(ratingMatch[1]);
                } else {
                    interview.rating = 0;
                }

                interview.aiFeedback = aiFeedback;

                await Job.updateOne(
                    { _id: jobId, "applicants.applicantId": applicantId },
                    { $set: { "applicants.$.status": "interview_completed", "applicants.$.rating": interview.rating } },
                );
            } catch (aiError) {
                console.error("Error generating AI feedback:", aiError);
                interview.rating = "AI feedback generation failed";
            }
        }

        await interview.save();

        res.status(200).json({ 
            success: true, 
            message: "Interview completed successfully.", 
            interview,
            aiFeedback: interview.rating
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

interviewController.decision = async (req, res) => {
    const { jobId, applicantId, decision } = req.body;
    const hrId = req.userId;

    try {
        if(!jobId || !applicantId || !decision) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (!["hired", "rejected"].includes(decision)) {
            return res.status(400).json({ success: false, message: "Decision must be either 'hired' or 'rejected'." });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        const applicant = job.applicants.find(app => app.applicantId.toString() === applicantId);

        if (!applicant) {
            return res.status(404).json({ success: false, message: "Applicant not found for this job." });
        }

        if (applicant.status !== "interview_completed") {
            return res.status(400).json({ success: false, message: "Interview must be completed before making a decision." });
        }

        await Job.updateOne(
            { _id: jobId, "applicants.applicantId": applicantId },
            { $set: { "applicants.$.status": decision } }
        );

        await Interview.updateOne(
            { jobId, applicantId, hrId },
            { $set: { status: decision } }
        );

        const actionMessage = decision === "hired" ? "Candidate hired successfully!" : "Candidate rejected successfully.";

        res.status(200).json({ success: true, message: actionMessage, decision });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong." });
    }
};

module.exports = interviewController;