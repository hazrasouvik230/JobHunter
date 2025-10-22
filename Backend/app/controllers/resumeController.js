const Resume = require("../models/resumeModal");
const User = require("../models/userModel");
const { resumeValidationSchema, educationValidationSchema } = require("../validations/resumeValidation");

const resumeController = {};

resumeController.getMyProfile = async (req, res) => {
    try {
        const profile = await User.findById(req.userId);
        const resume = await Resume.findOne({ userId: req.userId });

        res.status(200).json({ success: true, profile, resume: resume || null });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

resumeController.createResume = async (req, res) => {
    const { error, value } = resumeValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }

    try {
        const user = await User.findById(req.userId).select("name email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // let resume = await Resume.findOne({ userId: req.userId });

        const resumeData = { userId: req.userId, name: user.name, email: user.email, ...value };
        const resume = new Resume(resumeData);
        await resume.save();
    
        res.status(200).json({ success: true, message: "Resume created successfully!", resume });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

resumeController.addEducation = async (req, res) => {
    const { error, value } = educationValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }

    try {
        const result = await Resume.updateOne(
            { userId: req.userId },
            { $addToSet: { educations: value } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "Resume not found. Please create a resume first." });
        }

        res.status(200).json({ success: true, message: "Education added successfully (if not already present)." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

resumeController.deleteEducation = async (req, res) => {
    try {
        const userId = req.userId;
        const educationId = req.params.id;

        const updateResume = await Resume.findOneAndUpdate({userId}, { $pull: { educations: { _id: educationId } } }, { new: true });
        if(!updateResume) {
            return res.status(404).json({ success: false, message: "Resume not found." });
        }

        res.status(200).json({ success: true, message: "Education deleted successfully.", resume: updateResume })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

resumeController.addExperience = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.userId });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found. Please create a resume first." });
        }

        resume.experiences.push(req.body);
        await resume.save();

        res.status(200).json({ success: true, message: "Experience added successfully", resume });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

resumeController.deleteExperience = async (req, res) => {
    try {
        const userId = req.userId;
        const experienceId = req.params.id; 

        const updateResume = await Resume.findOneAndUpdate({ userId }, { $pull: { experiences: { _id: experienceId } } }, { new: true });
        if(!updateResume) {
            return res.status(404).json({ success: false, message: "Resume not found." });
        }

        res.status(200).json({ success: true, message: "Experience deleted successfully.", resume: updateResume })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

resumeController.addProject = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.userId });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found. Please create a resume first." });
        }

        resume.projects.push(req.body);
        await resume.save();

        res.status(200).json({ success: true, message: "Project added successfully", resume });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

resumeController.deleteProject = async (req, res) => {
    try {
        const userId = req.userId;
        const projectId = req.params.id;

        const updateResume = await Resume.findOneAndUpdate({ userId }, { $pull: { projects: { _id: projectId } } }, { new: true });
        if(!updateResume) {
            return res.status(404).json({ success: false, message: "Resume not found." });
        }

        res.status(200).json({ success: true, message: "Project deleted successfully.", resume: updateResume })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

resumeController.addCertificate = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.userId });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found. Please create a resume first." });
        }

        resume.certificates.push(req.body);
        await resume.save();

        res.status(200).json({ success: true, message: "Certificate added successfully", resume });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

resumeController.deleteCertificate = async (req, res) => {
    try {
        const userId = req.userId;
        const certificateId = req.params.id;

        const updateResume = await Resume.findOneAndUpdate({ userId }, { $pull: { certificates: { _id: certificateId } } }, { new: true });
        if(!updateResume) {
            return res.status(404).json({ success: false, message: "Resume not found." });
        }

        res.status(200).json({ success: true, message: "Certificate deleted successfully.", resume: updateResume })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

module.exports = resumeController;