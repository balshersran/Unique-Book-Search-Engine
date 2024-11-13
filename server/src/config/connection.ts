import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = 'mongodb://127.0.0.1:27017/googlebooks' || '';
console.log(MONGODB_URI);

const db = async (): Promise<typeof mongoose.connection> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database connected.');
        return mongoose.connection;
    } catch (error) {
        console.log('Database connection error:', error);
        throw new Error('Database connection failed.');
    }
}

export default db;
