import fs from 'fs';
import axios from 'axios';
import mongoose from 'mongoose';
import Boom from 'boom';
import AWS from 'aws-sdk';
import credentials from '../credentials';

import User from './user';
import Post from './post';
import Comment from './comment';



const books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
    },
];

const resolvers = {
    Query: {
        ...Post.Query,
        ...User.Query,
        ...Comment.Query,
        books: () => books
    },
    Mutation: {
        ...Post.Mutation,
    }
};

export default resolvers;