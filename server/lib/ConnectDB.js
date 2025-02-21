require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("db connected");
  }
};

module.exports = connectDB;
