require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const configureDB = require("./app/database/db");
configureDB();

const userController = require("./app/controllers/userController");
const jobController = require("./app/controllers/jobController");
const resumeController = require("./app/controllers/resumeController");

const authenticateUser = require("./app/middlewares/authenticateUser");
const authorizeUser = require("./app/middlewares/authorizeUser");

const upload = require("./app/middlewares/upload");

// User Routes
app.post("/api/register", upload.single("companyLogo"), userController.register); // Registration ✅
app.post("/api/login", userController.login);   // Login ✅
app.get("/api/list", userController.list);   // List ✅
app.get("/api/allAppliedJobs", authenticateUser, authorizeUser(["User"]), userController.allAppliedJobs);    // All applied jobs ✅
app.get("/api/savedJobs", authenticateUser, authorizeUser(["User"]), userController.savedJobs);    // All saved jobs ✅

// Resume
app.get("/api/myProfile", authenticateUser, resumeController.getMyProfile);
app.post("/api/createResume", authenticateUser, resumeController.createResume);

app.post("/api/resume/education", authenticateUser, resumeController.addEducation);
app.post("/api/resume/experience", authenticateUser, resumeController.addExperience);
app.post("/api/resume/project", authenticateUser, resumeController.addProject);
app.post("/api/resume/certificate", authenticateUser, resumeController.addCertificate);

// Job Route
app.post("/api/job", authenticateUser, authorizeUser(["HR"]), jobController.create); // Create a job ✅
app.post("/api/job/generateDescription", authenticateUser, authorizeUser(["HR"]), jobController.generateJobDescription);    // Generating job description externally ✅
app.get("/api/job", authenticateUser, authorizeUser(["User"]), jobController.getAllJobs);   // List of all jobs ✅
app.get("/api/job/allPostedJobsByHR", authenticateUser, authorizeUser(["HR"]), jobController.allPostedJobsByHR);    // All posted jobs by the specific user ✅
app.get("/api/job/getSpecificJob/:id", authenticateUser, authorizeUser(["User", "HR"]), jobController.getSpecificJob);  // Get a specific job ✅
app.post("/api/job/applyJob/:id", authenticateUser, authorizeUser(["User"]), jobController.apply);  // Apply for a job ✅
app.post("/api/job/saveJob/:id", authenticateUser, authorizeUser(["User"]), jobController.saveJob);  // Save a job ✅
app.delete("/api/job/unsaveJob/:id", authenticateUser, authorizeUser(["User"]), jobController.unsaveJob);  // Unsave a job

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});