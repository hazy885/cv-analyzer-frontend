import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    
    // Create a reference to the database
    const db = client.db();
    
    // Return both client and db for use in application
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getClient = () => client;