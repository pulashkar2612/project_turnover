const mongoose = require("mongoose");

// Mongo DB Connection
const mongodbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL + "/turnover-ecommerce-app");
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = mongodbConnection;