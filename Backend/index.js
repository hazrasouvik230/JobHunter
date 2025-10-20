require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

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

// const upload = require("./app/middlewares/upload");
const { uploadImages, uploadResumes } = require("./app/middlewares/upload");

const interviewController = require("./app/controllers/interviewController");
const checkSubscription = require("./app/middlewares/checkSubscription");

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const emailToSocketId = new Map();
const socketIdToEmail = new Map();
const socketIdToRole = new Map();
const socketToRoom = new Map();

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("room:join", data => {
        const { email, roomId, role } = data;
        console.log(`User ${email} joining room ${roomId} as ${role}`);
        
        emailToSocketId.set(email, socket.id);
        socketIdToEmail.set(socket.id, email);
        socketIdToRole.set(socket.id, role);
        socketToRoom.set(socket.id, roomId);
        
        // Join the room
        socket.join(roomId);
        
        // Get all users in the room
        const roomUsers = [];
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        
        if (roomSockets) {
            roomSockets.forEach(socketId => {
                if (socketId !== socket.id) {
                    roomUsers.push({
                        socketId: socketId,
                        email: socketIdToEmail.get(socketId),
                        role: socketIdToRole.get(socketId)
                    });
                }
            });
        }
        
        // Notify the user they joined successfully
        socket.emit("room:join", { 
            roomId, 
            email, 
            role,
            existingUsers: roomUsers // Send existing users in room
        });
        
        // Notify others in the room that someone joined
        socket.to(roomId).emit("user:joined", { 
            email, 
            role,
            socketId: socket.id 
        });
    });

    socket.on("user:call", ({ to, offer }) => {
        console.log(`Call from ${socket.id} to ${to}`);
        io.to(to).emit("incoming:call", { 
            from: socket.id, 
            offer 
        });
    });

    socket.on("call:accepted", ({ to, answer }) => {
        console.log(`Call accepted from ${socket.id} to ${to}`);
        io.to(to).emit("call:accepted", { 
            from: socket.id, 
            answer 
        });
    });

    // New: Peer-to-peer signaling for ICE candidates
    socket.on("ice-candidate", ({ to, candidate }) => {
        io.to(to).emit("ice-candidate", {
            from: socket.id,
            candidate
        });
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        const email = socketIdToEmail.get(socket.id);
        const roomId = socketToRoom.get(socket.id);
        
        if (email) {
            emailToSocketId.delete(email);
            socketIdToEmail.delete(socket.id);
            socketIdToRole.delete(socket.id);
            socketToRoom.delete(socket.id);
        }
        
        if (roomId) {
            socket.to(roomId).emit("user:left", { 
                email,
                socketId: socket.id 
            });
        }
    });
});

// User Routes
// app.post("/api/register", upload.single("companyLogo"), userController.register); // Registration ✅
app.post("/api/register", uploadImages.single("companyLogo"), userController.register); // Registration ✅
app.post("/api/login", userController.login);   // Login ✅
app.get("/api/list", userController.list);   // List ✅
app.get("/api/specificUserDetails/:id", authenticateUser, authorizeUser(["Admin"]), userController.specificUserDetails);   // List ✅
app.get("/api/allAppliedJobs", authenticateUser, authorizeUser(["User"]), userController.allAppliedJobs);    // All applied jobs ✅
app.get("/api/savedJobs", authenticateUser, authorizeUser(["User"]), userController.savedJobs);    // All saved jobs ✅
app.put("/api/updateProfileImage", authenticateUser, uploadImages.single("profileImage"), userController.updateProfileImage);
app.put("/api/updateCompanyLogo", authenticateUser, uploadImages.single("companyLogo"), userController.updateCompanyLogo);
app.get("/api/admin/companies", authenticateUser, authorizeUser(["Admin"]), userController.companies);
app.delete(`/api/admin/removeUser/:id`, authenticateUser, authorizeUser(["Admin"]), userController.removeUser);

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
app.put("/api/job/:id", authenticateUser, authorizeUser(["HR"]), jobController.update);
app.post("/api/job/generateDescription", authenticateUser, authorizeUser(["HR"]), jobController.generateJobDescription);    // Generating job description externally ✅
app.post("/api/job/generateShortDesc", authenticateUser, authorizeUser(["HR"]), jobController.generateShortDesc);    // Generating short description externally ✅
app.get("/api/job", authenticateUser, authorizeUser(["User"]), jobController.getAllJobs);   // List of all jobs ✅
app.get("/api/job/allPostedJobsByHR", authenticateUser, authorizeUser(["HR"]), jobController.allPostedJobsByHR);    // All posted jobs by the specific user ✅
app.get("/api/job/getSpecificJob/:id", authenticateUser, authorizeUser(["User", "HR"]), jobController.getSpecificJob);  // Get a specific job ✅
// app.post("/api/job/applyJob/:id", authenticateUser, authorizeUser(["User"]), jobController.apply);  // Apply for a job ✅
app.post("/api/job/applyJob/:id", authenticateUser, authorizeUser(["User"]), uploadResumes.single("resumePath"), jobController.apply);  // Apply for a job ✅
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
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket.IO server is also running on port ${PORT}`);
});