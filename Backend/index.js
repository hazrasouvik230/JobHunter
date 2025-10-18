require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
const interviewController = require("./app/controllers/interviewController");
const checkSubscription = require("./app/middlewares/checkSubscription");

// User Routes
app.post("/api/register", upload.single("companyLogo"), userController.register); // Registration ✅
app.post("/api/login", userController.login);   // Login ✅
app.get("/api/list", userController.list);   // List ✅
app.get("/api/specificUserDetails/:id", authenticateUser, authorizeUser(["Admin"]), userController.specificUserDetails);   // List ✅
app.get("/api/allAppliedJobs", authenticateUser, authorizeUser(["User"]), userController.allAppliedJobs);    // All applied jobs ✅
app.get("/api/savedJobs", authenticateUser, authorizeUser(["User"]), userController.savedJobs);    // All saved jobs ✅
app.put("/api/updateProfileImage", authenticateUser, upload.single("profileImage"), userController.updateProfileImage);
app.put("/api/updateCompanyLogo", authenticateUser, upload.single("companyLogo"), userController.updateCompanyLogo);
app.get("/api/admin/companies", authenticateUser, authorizeUser(["Admin"]), userController.companies);

// Resume
app.get("/api/myProfile", authenticateUser, resumeController.getMyProfile);
app.post("/api/createResume", authenticateUser, resumeController.createResume);

app.post("/api/resume/education", authenticateUser, resumeController.addEducation);
app.delete("/api/resume/education/:id", authenticateUser, resumeController.deleteEducation);
app.post("/api/resume/experience", authenticateUser, resumeController.addExperience);
app.delete("/api/resume/experience/:id", authenticateUser, resumeController.deleteExperience);
app.post("/api/resume/project", authenticateUser, resumeController.addProject);
app.delete("/api/resume/project/:id", authenticateUser, resumeController.deleteProject);
app.post("/api/resume/certificate", authenticateUser, resumeController.addCertificate);
app.delete("/api/resume/certificate/:id", authenticateUser, resumeController.deleteCertificate);

// Job Route
// app.post("/api/job", authenticateUser, authorizeUser(["HR"]), jobController.create); // Create a job ✅
app.post("/api/job", authenticateUser, authorizeUser(["HR"]), checkSubscription, jobController.create); // Create a job ✅
app.post("/api/job/generateDescription", authenticateUser, authorizeUser(["HR"]), jobController.generateJobDescription);    // Generating job description externally ✅
app.post("/api/job/generateShortDesc", authenticateUser, authorizeUser(["HR"]), jobController.generateShortDesc);    // Generating short description externally ✅
app.get("/api/job", authenticateUser, authorizeUser(["User"]), jobController.getAllJobs);   // List of all jobs ✅
app.get("/api/job/allPostedJobsByHR", authenticateUser, authorizeUser(["HR"]), jobController.allPostedJobsByHR);    // All posted jobs by the specific user ✅
app.get("/api/job/getSpecificJob/:id", authenticateUser, authorizeUser(["User", "HR"]), jobController.getSpecificJob);  // Get a specific job ✅
app.post("/api/job/applyJob/:id", authenticateUser, authorizeUser(["User"]), jobController.apply);  // Apply for a job ✅
app.delete("/api/job/revokeApplication/:id", authenticateUser, authorizeUser(["User"]), jobController.revoke);
app.get("/api/job/savedJobs", authenticateUser, authorizeUser(["User"]), jobController.getSavedJobs);  // Get saved jobs with pagination ✅
app.post("/api/job/saveJob/:id", authenticateUser, authorizeUser(["User"]), jobController.saveJob);  // Save a job ✅
app.delete("/api/job/unsaveJob/:id", authenticateUser, authorizeUser(["User"]), jobController.unsaveJob);  // Unsave a job

const subscriptionController = require("./app/controllers/subscriptionController");

// Subscription Routes
app.get("/api/subscription/current", authenticateUser, authorizeUser(["HR"]), subscriptionController.getCurrentSubscription);
app.get("/api/subscription/plans", authenticateUser, authorizeUser(["HR"]), subscriptionController.getSubscriptionPlans);
app.post("/api/subscription/create-order", authenticateUser, authorizeUser(["HR"]), subscriptionController.createSubscriptionOrder);
app.post("/api/subscription/verify-payment", authenticateUser, authorizeUser(["HR"]), subscriptionController.verification);
app.post("/api/subscription/cancel", authenticateUser, authorizeUser(["HR"]), subscriptionController.cancelSubscription);
app.get("/api/subscription/get-key", authenticateUser, subscriptionController.getRazorpayKey);
app.get('/api/admin/transactions', authenticateUser, authorizeUser(['Admin']), subscriptionController.transactions);


app.post("/api/interview/scheduleInterview", authenticateUser, authorizeUser(["HR"]), interviewController.scheduleInterview);
app.put("/api/interview/specificJobRejection", authenticateUser, authorizeUser(["HR"]), interviewController.specificJobRejection);
app.get("/api/interview/getInterviews", authenticateUser, authorizeUser(["User"]), interviewController.getInterviewByApplicant);
app.get("/api/interview/getInterviewByHR", authenticateUser, authorizeUser(["HR"]), interviewController.getInterviewByHR);
app.get("/api/interview/getInterviewByHR/:id", authenticateUser, authorizeUser(["HR"]), interviewController.getSpecificJobInterviews);
app.get("/api/interview/specificInterview/:meetingLink", authenticateUser, authorizeUser(["User", "HR"]), interviewController.specificInterview);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});