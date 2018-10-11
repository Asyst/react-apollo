import mongoose from 'mongoose';
import credentials from '../credentials';
// import getLogger from '../lib/log';

// import { insertPosts } from '../post';

import { v4 } from 'uuid';

const coonectDB = () => {
    mongoose.connect('mongodb://admin:123456@ds139436.mlab.com:39436/chuguev-info');

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