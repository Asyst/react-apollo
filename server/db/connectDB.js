import mongoose from 'mongoose';
import credentials from '../credentials';
// import getLogger from '../lib/log';

// import { insertPosts } from '../post';

import { v4 } from 'uuid';

const coonectDB = () => {
    mongoose.connect(credentials.mongoDB.dev, { useNewUrlParser: true });

    const db = mongoose.connection;

    db.on('error', () => {
        console.error.bind(console, 'DB connection error: ');
    });
    db.on('connected', () => {
        console.log(`DB connected...`);
        // insertPosts(dataDB.posts);
    });
};

export default coonectDB;