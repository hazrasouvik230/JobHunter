// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,
//     role: String,
//     companyName: {
//         type: String,
//         required: function() {
//             return this.role === 'HR';
//         }
//     },
//     companyLogo: {
//         type: String,
//         required: function() {
//             return this.role === 'HR';
//         }
//     },
//     appliedJobs: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Job"
//     }],
//     savedJobs: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Job"
//     }]
// }, { timestamps: true });

// const User = mongoose.model("User", userSchema);

// module.exports = User;




























const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    companyName: {
        type: String,
        required: function() {
            return this.role === 'HR';
        }
    },
    companyLogo: {
        type: String,
        required: function() {
            return this.role === 'HR';
        }
    },
    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    }],
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    }],
    profileImage: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;