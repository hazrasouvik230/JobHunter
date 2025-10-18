const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Job = require("../models/jobModel");
const { userRegisterValidationSchema, userLoginValidationSchema } = require("../validations/userValidation");
const Resume = require("../models/resumeModal");

const userController = {};

userController.register = async (req, res) => {
    const { error, value } = userRegisterValidationSchema.validate(req.body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details.map(err => err.message)});
    }

    try {
        // Checks user's existance
        const isUserExist = await User.findOne({ email: value.email });
        if(isUserExist) {
            return res.status(400).json({ error: "User already exist." });
        }

        if(value.role === "HR") {
            if(!value.companyName || !value.companyName.trim()) {
                return res.status(400).json({ error: "Company name is required for HR role." });
            }
            if(!req.file) {
                return res.status(400).json({ error: "Company logo is required for HR role." })
            }
        }

        // Creating hashed password
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(value.password, salt);
        value.password = hashedPassword;

        if(value.role === "HR" && req.file) {
            value.companyLogo = req.file.filename;
        }

        const user = new User(value);
        await user.save();

        // Creating resume
        const resume = new Resume({
            userId: user._id,
            name: user.name,
            email: user.email
        });
        await resume.save();

        res.status(201).json({ success: true, message: "Registration done successfully!", user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

userController.login = async (req, res) => {
    const { error, value } = userLoginValidationSchema.validate(req.body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details.map(err => err.message )});
    }

    try {
        // Checks user existance
        const isUserExist = await User.findOne({ email: value.email });
        if(!isUserExist) {
            return res.status(404).json({ error: "Invalid email or password." });
        }
        
        // Comparing password
        const isCorrectPassword = await bcryptjs.compare(value.password, isUserExist.password);
        if(!isCorrectPassword) {
            return res.status(404).json({ error: "Invalid email or password." });
        }

        // Create token
        const tokenData = { userId: isUserExist._id, role: isUserExist.role };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "5h" });

        res.status(200).json({ success: true, message: "Login done successfully!", user: isUserExist, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

userController.list = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

userController.specificUserDetails = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id).populate("appliedJobs");
        if(!user) {
            res.status(404).json({ success: false, message: "User not found." });
        }

        const responseUser = { user };
        if(user.role === "HR") {
            const jobs = await Job.find({ postedBy: user._id });
            responseUser.jobs = jobs;
        }
        
        // res.status(200).json({ success: true, message: "User fetched successfully.", user });
        res.status(200).json({ success: true, message: "User fetched successfully.", responseUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while fetching a specific user details." });
    }
};

userController.allAppliedJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(req.userId).select("appliedJobs").populate({ path: "appliedJobs", options: { skip: skip, limit: limit, sort: { createdAt: 1 } } });
        if(!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const userWithCount = await User.findById(req.userId).select("appliedJobs");
        const totalAppliedJobs = userWithCount.appliedJobs.length;
        const totalPages = Math.ceil(totalAppliedJobs / limit);

        res.status(200).json({ success: true, appliedJobs: user.appliedJobs, pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalJobs: totalAppliedJobs,
            hasNext: page < totalPages,
            hasPrev: page > 1
        } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

userController.savedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("savedJobs");
        if(!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ success: true, savedJobs: user.savedJobs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

userController.updateProfileImage = async (req, res) => {
    try {
        // Check if file was uploaded
        if(!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided!" });
        }

        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Deletes the old file if that exists
        if(user.profileImage) {
            const fs = require("fs");
            const path = require("path");

            const oldImagePath = path.join(__dirname, "../../uploads/profile-images", user.profileImage);

            fs.unlink(oldImagePath, (err) => {
                if(err) {
                    console.log("Error for deleting the old profile image", err);
                }
            })
        }

        const updatedUser = await User.findByIdAndUpdate(req.userId, { profileImage: req.file.filename }, { new: true });

        res.status(200).json({ success: true, message: "Profile image updated successfully!", user: updatedUser, imageUrl: `/uploads/profile-images/${req.file.filename}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while updating the profile image." });
    }
};

userController.updateCompanyLogo = async (req, res) => {
    try {
        // Check if file was uploaded
        if(!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided!" });
        }

        const user = await User.findById(req.userId);
        if(!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Deletes the old file if that exists
        if(user.companyLogo) {
            const fs = require("fs");
            const path = require("path");

            const oldImagePath = path.join(__dirname, "../../uploads/company-logos", user.companyLogo);

            fs.unlink(oldImagePath, (err) => {
                if(err) {
                    console.log("Error for deleting the old profile image", err);
                }
            })
        }

        const updatedUser = await User.findByIdAndUpdate(req.userId, { companyLogo: req.file.filename }, { new: true });

        res.status(200).json({ success: true, message: "Company logo updated successfully!", user: updatedUser, imageUrl: `/uploads/company-logos/${req.file.filename}` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong while updating the profile image." });
    }
};

userController.companies = async (req, res) => {
    try {
        const companies = await User.find({ 
            role: 'HR',
            companyName: { $exists: true, $ne: "" } 
        }).select('name email companyName companyLogo profileImage createdAt');
        
        res.status(200).json({ success: true, companies });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went worng while fetching all companies" });
    }
};

module.exports = userController;