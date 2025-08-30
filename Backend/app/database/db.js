const mongoose = require("mongoose");

async function configureDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected successfully!");
    } catch (error) {
        console.log("DB connection problem!", error);
    }
}

module.exports = configureDB;