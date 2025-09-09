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

userController.allAppliedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate("appliedJobs");
        if(!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ success: true, appliedJobs: user.appliedJobs });
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

module.exports = userController;