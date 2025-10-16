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

        // Get pagination parameters from query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

                // Get total count for pagination info
        const totalJobs = await Job.countDocuments({ postedBy: req.userId });

        // Get jobs with pagination
        const jobs = await Job.find({ postedBy: req.userId })
            .populate("postedBy", "name email companyName companyLogo")
            .sort({ createdAt: -1 }) // Sort by latest first
            .skip(skip)
            .limit(limit);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalJobs / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        // const jobs = await Job.find({ postedBy: req.userId }).populate("User", ["name"]);
        // const jobs = await Job.find({ postedBy: req.userId }).populate("postedBy", "name email companyName companyLogo");

        res.status(200).json({ success: true, jobs, pagination: {
                currentPage: page,
                totalPages,
                totalJobs,
                hasNext,
                hasPrev,
                nextPage: hasNext ? page + 1 : null,
                prevPage: hasPrev ? page - 1 : null,
                limit
            } });
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
        const job = await Job.findById(jobId).populate("applicants.applicantId", ["name", "email"]);
        res.status(200).json({ success: true, job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while fetching specific job details." });
    }
};

// jobController.apply = async(req, res) => {
//     const jobId = req.params.id;
//     try {
//         if(req.role !== "User") {
//             return res.status(403).json({ error: "Forbidden: Only applicants can apply for the jobs." });
//         }

//         const job = await Job.findById(jobId);
//         if(!job) {
//             return res.status(404).json({ error: "Job not found!" });
//         }

//         if(job.applicants.includes(req.userId)) {
//             return res.status(400).json({ error: "You've already applied for this job." });
//         }

//         await Job.updateOne(
//             { _id: jobId },
//             { $addToSet: { applicants: req.userId }}
//         );

//         // job.applicants.push(req.userId);
//         // await job.save();

//         const applicant = await User.findById(req.userId);
//         if(!applicant) {
//             return res.status(404).json({ error: "User not found!" });
//         }
        
//         await User.updateOne(
//             { _id: req.userId },
//             { $addToSet: { appliedJobs: jobId } }
//         );
//         // applicant.appliedJobs.push(jobId);
//         // await applicant.save();
        
//         res.status(200).json({ success: true, message: "Successfully applied for the job." });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Something went wrong while applying for a job." });
//     }
// };

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

        // Check if user already applied (using the new schema structure)
        const alreadyApplied = job.applicants.some(
            applicant => applicant.applicantId.toString() === req.userId
        );

        if(alreadyApplied) {
            return res.status(400).json({ error: "You've already applied for this job." });
        }

        // Add applicant with the new structure
        job.applicants.push({
            applicantId: req.userId,
            status: "applied"
            // appliedAt will be automatically set by default
        });

        await job.save();

        // Update user's applied jobs
        const applicant = await User.findById(req.userId);
        if(!applicant) {
            return res.status(404).json({ error: "User not found!" });
        }
        
        // If User model also has appliedJobs array
        if (!applicant.appliedJobs.includes(jobId)) {
            applicant.appliedJobs.push(jobId);
            await applicant.save();
        }
        
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

jobController.getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        if (req.role !== "User") {
            return res.status(403).json({ error: "Forbidden: Only applicants can access saved jobs." });
        }

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get user with saved jobs populated and paginated
        const userWithSavedJobs = await User.findById(req.userId)
            .select('savedJobs')
            .populate({
                path: 'savedJobs',
                options: {
                    skip: skip,
                    limit: limit,
                    sort: { createdAt: -1 } // Sort by latest saved
                }
            });

        // Get total count for pagination info
        const totalSavedJobs = user.savedJobs.length;
        const totalPages = Math.ceil(totalSavedJobs / limit);

        res.status(200).json({
            success: true,
            savedJobs: userWithSavedJobs.savedJobs,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalJobs: totalSavedJobs,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
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

        // Get updated count for frontend
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

        // Get updated count for frontend
        const updatedUser = await User.findById(req.userId);
        const totalSaved = updatedUser.savedJobs.length;

        res.status(200).json({ success: true, message: "Job unsaved successfully.", totalSaved });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while unsaving the job." });
    }
};

module.exports = jobController;