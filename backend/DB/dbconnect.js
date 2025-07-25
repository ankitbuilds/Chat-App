import mongoose from "mongoose";

const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected successfully');
  } catch (error) {
    console.log('DB connection error:', error.message);
  }
};

export default dbconnect;
