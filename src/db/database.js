import mongoose from 'mongoose';
import { DBName } from '../constants.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MongoDb_URI}/${DBName}`
    );
    console.log(`MogoDb connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(`MongoDb Connection Error:${error}`);
    process.exit(1);
  }
};

export default connectDB;
