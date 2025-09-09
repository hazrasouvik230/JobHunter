// const Resume = require("../models/resumeModal");
// const User = require("../models/userModel");
// const { resumeValidationSchema, educationValidationSchema } = require("../validations/resumeValidation");

// const resumeController = {};

// resumeController.getMyProfile = async (req, res) => {
//     try {
//         const profile = await User.findById(req.userId);
//         const resume = await Resume.findOne({ userId: req.userId });

//         res.status(200).json({ success: true, profile, resume: resume || null });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Something went wrong." });
//     }
// };

// resumeController.createResume = async (req, res) => {
//     const { error, value } = resumeValidationSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//         return res.status(400).json({ error: error.details.map(err => err.message) });
//     }

//     try {
//         const user = await User.findById(req.userId).;
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         let resume = await Resume.findOne({ userId: req.userId });

//         const resumeData = { userId: req.userId, name: user.name, email: user.email, ...value };

//         if(resume) {
//             console.log("IF");
//             resume = await Resume.findByIdAndUpdate(resume._id, resumeData, { new: true });
//         } else {
//             resume = new Resume(resumeData);
//             await resume.save();
//             console.log("else");
//         }

//         res.status(200).json({ success: true, message: resume ? "Resume updated successfully!" : "Resume created successfully!", resume });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Something went wrong." });
//     }
// };

// resumeController.addEducation = async (req, res) => {
//     const { error, value } = educationValidationSchema.validate(req.body, { abortEarly: false });
//     if (error) {
//         return res.status(400).json({ error: error.details.map(err => err.message) });
//     }

//     try {
//         // const resume = await Resume.findOne({ userId: req.userId });
//         // if (!resume) {
//         //     return res.status(404).json({
//         //         success: false,
//         //         message: "Resume not found. Please create a resume first."
//         //     });
//         // }

//         // resume.educations.push(value);
//         // await resume.save();

//         const result = await Resume.updateOne(
//             { userId: req.userId },
//             { $addToSet: { educations: value } }
//         );

//         if (result.matchedCount === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Resume not found. Please create a resume first."
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Education added successfully (if not already present)."
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Something went wrong." });
//     }
// };

// // Add experience
// resumeController.addExperience = async (req, res) => {
//     try {
//         const resume = await Resume.findOne({ userId: req.userId });
//         if (!resume) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Resume not found. Please create a resume first."
//             });
//         }

//         resume.experiences.push(req.body);
//         await resume.save();

//         res.status(200).json({
//             success: true,
//             message: "Experience added successfully",
//             resume
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Something went wrong." });
//     }
// };

// // Add project
// resumeController.addProject = async (req, res) => {
//     try {
//         const resume = await Resume.findOne({ userId: req.userId });
//         if (!resume) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Resume not found. Please create a resume first."
//             });
//         }

//         resume.projects.push(req.body);
//         await resume.save();

//         res.status(200).json({
//             success: true,
//             message: "Project added successfully",
//             resume
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Something went wrong." });
//     }
// };

// // Add certificate
// resumeController.addCertificate = async (req, res) => {
//     try {
//         const resume = await Resume.findOne({ userId: req.userId });
//         if (!resume) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Resume not found. Please create a resume first."
//             });
//         }

//         resume.certificates.push(req.body);
//         await resume.save();

//         res.status(200).json({
//             success: true,
//             message: "Certificate added successfully",
//             resume
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: "Something went wrong." });
//     }
// };

// module.exports = resumeController;




















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

        // if(resume) {
        //     console.log("IF");
        //     resume = await Resume.findByIdAndUpdate(resume._id, resumeData, { new: true });
        // } else {
            const resume = new Resume(resumeData);
            await resume.save();
        //     console.log("else");
        // }

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
        // const resume = await Resume.findOne({ userId: req.userId });
        // if (!resume) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Resume not found. Please create a resume first."
        //     });
        // }

        // resume.educations.push(value);
        // await resume.save();

        const result = await Resume.updateOne(
            { userId: req.userId },
            { $addToSet: { educations: value } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Resume not found. Please create a resume first."
            });
        }

        res.status(200).json({
            success: true,
            message: "Education added successfully (if not already present)."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

// Add experience
resumeController.addExperience = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.userId });
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found. Please create a resume first."
            });
        }

        resume.experiences.push(req.body);
        await resume.save();

        res.status(200).json({
            success: true,
            message: "Experience added successfully",
            resume
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

// Add project
resumeController.addProject = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.userId });
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found. Please create a resume first."
            });
        }

        resume.projects.push(req.body);
        await resume.save();

        res.status(200).json({
            success: true,
            message: "Project added successfully",
            resume
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

// Add certificate
resumeController.addCertificate = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.userId });
        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found. Please create a resume first."
            });
        }

        resume.certificates.push(req.body);
        await resume.save();

        res.status(200).json({
            success: true,
            message: "Certificate added successfully",
            resume
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

module.exports = resumeController;