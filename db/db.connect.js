const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const initialization = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGO_URI);

    if (connectDB) {
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { initialization };
