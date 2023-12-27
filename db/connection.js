// db.js
const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    const connectionString = process.env.MONGODB_URI;
    console.log(connectionString,"connectionstring")
    await mongoose.connect(connectionString)
  } catch (error) {
    console.log(error,"erorr");
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectToDatabase;
