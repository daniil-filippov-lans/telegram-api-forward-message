import mongoose from 'mongoose';
import { db } from '../configuration';

export const connectDb = () => {
    mongoose.connect(db, {});

    return mongoose.connection;
};
