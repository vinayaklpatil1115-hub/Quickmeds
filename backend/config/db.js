import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medifind';
    console.log(`Connecting to: ${uri}...`);
    const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
