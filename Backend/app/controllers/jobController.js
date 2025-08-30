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

        value.description = await generateJobDescription(value);

        const job = new Job({ ...value, postedBy: req.userId });
        await job.save();

        res.status(201).json({ success: true, message: "Job created successfully!", job });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while creating the job." })
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

        const jobs = await Job.find();
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while fetching jobs." });
    }
};

module.exports = jobController;