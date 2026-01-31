const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://lokasamyoga:lok12345@lokasamyoga.xyw0w9a.mongodb.net/lokasamyoga?retryWrites=true&w=majority"
    );
    console.log("MongoDB Atlas connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
