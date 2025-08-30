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
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;