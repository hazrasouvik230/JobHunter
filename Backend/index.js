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

const authenticateUser = require("./app/middlewares/authenticateUser");
const authorizeUser = require("./app/middlewares/authorizeUser");

const upload = require("./app/middlewares/upload");

// User Routes
app.post("/api/register", upload.single("companyLogo"), userController.register); // Registration ✅
app.post("/api/login", userController.login);   // Login ✅
app.get("/api/list", userController.list);   // List ✅

// Job Route
app.post("/api/job", authenticateUser, authorizeUser(["HR"]), jobController.create); // Create a job ✅
app.get("/api/job", authenticateUser, authorizeUser(["User"]), jobController.getAllJobs);   // List of all jobs ✅

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});