const Job = require("../models/jobModel");
const User = require("../models/userModel");
const generateJobDescription = require("../utils/generateJobDescription");

const jobValidationSchema = require("../validations/jobValidation");

const jobController = {};

jobController.create = async(req, res) => {
    const { error, value } = jobValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }

    try {
        if(req.role !== "HR") {
            return res.status(403).json({ error: "Forbidden: Only HR can create jobs."});
        }

        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if(!value.description || value.description.trim() === "") {
            value.description = await generateJobDescription(value);
        }

        const job = new Job({ ...value, postedBy: req.userId, companyName: user.companyName, companyLogo: user.companyLogo });
        await job.save();

        // Increment job post count in subscription
        if(req.subscription) {
            req.subscription.jobPostsUsed += 1;
            await req.subscription.save();
        }

        res.status(201).json({ success: true, message: "Job created successfully!", job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while creating the job." })
    }
};

jobController.generateJobDescription = async(req, res) => {
    try {
        const description = await generateJobDescription(req.body);
        res.status(200).json({ success: true, description });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "AI description generation failed." });
    }
};

jobController.allPostedJobsByHR = async(req, res) => {
    try {
        if(req.role !== "HR") {
            return res.status(403).json({ error: "Forbidden: Only HRs can view their posted jobs." });
        }

        // const jobs = await Job.find({ postedBy: req.userId }).populate("User", ["name"]);
        const jobs = await Job.find({ postedBy: req.userId }).populate("postedBy", "name email companyName companyLogo");

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while fetching jobs which was posted by the this HR." });
    }
};

jobController.getAllJobs = async(req, res) => {
    try {
        if(req.role !== "User") {
            return res.status(403).json({ error: "Forbidden: Only Users can see all jobs."});
        }

        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;

        const jobs = await Job.find().skip(skip).limit(limit).populate("postedBy", "name email companyName companyLogo");

        const totalJobs = await Job.countDocuments();
        const totalPages = Math.ceil(totalJobs / limit);

        res.status(200).json({ success: true, jobs, pagination: { currentPage: page, totalPages, totalJobs, limit } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while fetching jobs." });
    }
};

jobController.getSpecificJob = async(req, res) => {
    const jobId = req.params.id;
    try {
        const job = await Job.findById(jobId).populate("applicants", ["name", "email"]);
        res.status(200).json({ success: true, job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while fetching specific job details." });
    }
};

jobController.apply = async(req, res) => {
    const jobId = req.params.id;
    try {
        if(req.role !== "User") {
            return res.status(403).json({ error: "Forbidden: Only applicants can apply for the jobs." });
        }

        const job = await Job.findById(jobId);
        if(!job) {
            return res.status(404).json({ error: "Job not found!" });
        }

        if(job.applicants.includes(req.userId)) {
            return res.status(400).json({ error: "You've already applied for this job." });
        }

        await Job.updateOne(
            { _id: jobId },
            { $addToSet: { applicants: req.userId }}
        );

        // job.applicants.push(req.userId);
        // await job.save();

        const applicant = await User.findById(req.userId);
        if(!applicant) {
            return res.status(404).json({ error: "User not found!" });
        }
        
        await User.updateOne(
            { _id: req.userId },
            { $addToSet: { appliedJobs: jobId } }
        );
        // applicant.appliedJobs.push(jobId);
        // await applicant.save();
        
        res.status(200).json({ success: true, message: "Successfully applied for the job." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while applying for a job." });
    }
};

jobController.revoke = async (req, res) => {
    const jobId = req.params.id;
    try {
        if(req.role !== "User") {
            return res.status(403).json({ error: "Forbidden: Only applicants can apply for the jobs." });
        }

        await Job.updateOne(
            { _id: jobId },
            { $pull: { applicants: req.userId }}
        );

        await User.updateOne(
            { _id: req.userId },
            { $pull: { appliedJobs: jobId }}
        );

        res.status(200).json({ succes: true, message: "Applicant revoke successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while revoking an application." });
    }
};

jobController.saveJob = async (req, res) => {
    const jobId = req.params.id;
    try {
        const job = await Job.findById(jobId);
        if(!job) {
            return res.status(404).json({ error: "Job not found!" });
        }
        
        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        if(req.role !== "User") {
            return res.status(403).json({ error: "Forbidden: Only applicants can apply for the jobs." });
        }

        if(user.savedJobs.includes(jobId)) {
            return res.status(400).json({ error: "Job is already saved." });
        }

        await User.updateOne(
            { _id: req.userId },
            { $addToSet: { savedJobs: jobId } }
        );

        res.status(200).json({ success: true, message: "Job saved successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while saving the job." })
    }
};

jobController.unsaveJob = async (req, res) => {
    const jobId = req.params.id;
    try {
        const job = await Job.findById(jobId);
        if(!job) {
            return res.status(404).json({ error: "Job not found!" });
        }
        
        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        if(req.role !== "User") {
            return res.status(403).json({ error: "Forbidden: Only applicants can apply for the jobs." });
        }

        if(!user.savedJobs.includes(jobId)) {
            return res.status(400).json({ error: "Job is not saved." });
        }

        await User.updateOne(
            { _id: req.userId },
            { $pull: { savedJobs: jobId } }
        );

        res.status(200).json({ success: true, message: "Job unsaved successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while unsaving the job." });
    }
};

module.exports = jobController;