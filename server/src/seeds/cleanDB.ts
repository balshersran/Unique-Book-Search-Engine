import { User } from '../models/index.js';
import process from 'process';

const cleanDB = async ():Promise<void> => {
    try {
        await User.deleteMany({});
        console.log('User Collection cleaned.');

    } catch (error) {
        console.error('Error cleaning collections:',error);
        process.exit(1);
    }
};

export default cleanDB;