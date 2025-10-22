const Job = require("../models/jobModel");
const User = require("../models/userModel");
const { generateJobDescription, generateShortDesc } = require("../utils/generateJobDescription");

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

jobController.generateShortDesc = async(req, res) => {
    try {
        const description = await generateShortDesc(req.body);
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

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalJobs = await Job.countDocuments({ postedBy: req.userId });

        const jobs = await Job.find({ postedBy: req.userId })
            .populate("postedBy", "name email companyName companyLogo")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalJobs / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        res.status(200).json({ success: true, jobs, pagination: { currentPage: page, totalPages, totalJobs, hasNext, hasPrev, nextPage: hasNext ? page + 1 : null, prevPage: hasPrev ? page - 1 : null, limit } });
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

        const jobs = await Job.find({ deadline: { $gte: new Date() } });
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while fetching jobs." });
    }
};

jobController.getSpecificJob = async(req, res) => {
    const jobId = req.params.id;
    try {
        const job = await Job.findById(jobId).populate("applicants.applicantId", ["name", "email"]);
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

        if(!req.file) {
            return res.status(400).json({ error: "Please upload your resume while appling for this job role.", requiredResume: true });
        }

        const allowedTypes = ['application/pdf'];
        if(!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: "Invalid file type.", requiredResume: true });
        }

        const job = await Job.findById(jobId);
        if(!job) {
            return res.status(404).json({ error: "Job not found!" });
        }

        const alreadyApplied = job.applicants.some(
            applicant => applicant.applicantId.toString() === req.userId
        );

        if(alreadyApplied) {
            return res.status(400).json({ error: "You've already applied for this job." });
        }

        job.applicants.push({ applicantId: req.userId, status: "applied", resumePath: req.file.path });

        await job.save();

        const applicant = await User.findById(req.userId);
        if(!applicant) {
            return res.status(404).json({ error: "User not found!" });
        }

        if (!applicant.appliedJobs.includes(jobId)) {
            applicant.appliedJobs.push(jobId);
            await applicant.save();
        }
        
        res.status(200).json({ success: true, message: "Successfully applied for the job.", resumeFileName: req.file.filename });
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

jobController.getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        if (req.role !== "User") {
            return res.status(403).json({ error: "Forbidden: Only applicants can access saved jobs." });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const userWithSavedJobs = await User.findById(req.userId)
            .select('savedJobs')
            .populate({ path: 'savedJobs', options: { skip: skip, limit: limit, sort: { createdAt: -1 } } });

        const totalSavedJobs = user.savedJobs.length;
        const totalPages = Math.ceil(totalSavedJobs / limit);

        res.status(200).json({
            success: true,
            savedJobs: userWithSavedJobs.savedJobs,
            pagination: { currentPage: page, totalPages: totalPages, totalJobs: totalSavedJobs, hasNext: page < totalPages, hasPrev: page > 1 } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while fetching saved jobs." });
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

        const updatedUser = await User.findById(req.userId);
        const totalSaved = updatedUser.savedJobs.length;

        res.status(200).json({ success: true, message: "Job saved successfully.", totalSaved });
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

        const updatedUser = await User.findById(req.userId);
        const totalSaved = updatedUser.savedJobs.length;

        res.status(200).json({ success: true, message: "Job unsaved successfully.", totalSaved });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while unsaving the job." });
    }
};

jobController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, location, jobType, requirements, experienceLevel, salary, deadline, description } = req.body;

        const job = await Job.findById(id);

        if(!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        if(job.postedBy.toString() != req.userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorize." });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            id, { title, location, jobType, requirements, experienceLevel, salary, deadline, description },
            { new: true, runValidators: true }
        );
        
        res.status(200).json({ success: true, message: "Job updated successfully", job: updatedJob });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to update job" });
    }
};

module.exports = jobController;