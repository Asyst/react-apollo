import fs from 'fs';
import axios from 'axios';
import mongoose from 'mongoose';
import Boom from 'boom';
import AWS from 'aws-sdk';
import credentials from '../credentials';

import User from '../user/user.model';
import Post from '../post/post.model';
import Comment from '../comment/comment.model';

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
        posts: async () => await Post.find().exec(),
        post: async (obj, args, context, info) => await Post.findById(args.id).exec(),
        users: async () => await User.find().exec(),
        user: async (obj, args, context, info) => {
            // console.log('user -> ', await User.find().where('facebookId', args.facebookId).exec());
            return await User.find().where('facebookId', args.facebookId).exec();
        },
        comments: async () => await Comment.find().exec(),
        books: () => books
    },
    Mutation: {
        addPost: async (parent, { input }, context) => {
            console.log('Add Post Mutation -> ', input);

            const { author, title, image, text, tags } = input;

            try {
                const userId = author; 
                const [file] = image;
                const filename = file.name;

                console.log("image -> ", Array.isArray(image));
                console.log("file -> ", file);

                const keyName = `post-${ userId }-${ filename }`;

                const f = fs.readFileSync(`temp/${ filename }`);

                console.log("file f -> ", f);

                const s3 = new AWS.S3({
                    apiVersion: '2006-03-01',
                    accessKeyId: credentials.aws_access_key_id,
                    secretAccessKey: credentials.aws_secret_access_key,
                    region: 'us-west-1'
                });

                s3.upload({ 
                    Bucket: 'chuguev-info-posts-images',
                    Key: keyName,
                    Body: f,
                    ACL: 'public-read'
                }, (err, data) => {
                    if (err) {
                        console.log("Error -> ", err);

                        return new Boom(err);
                    }
            
                    console.log("Successfully -> ", data);
                });

                const post = await new Post({
                    _id: new mongoose.Types.ObjectId(),
                    // id: v4(),
                    author: userId,
                    // author_id: user._id,
                    date: Date.now(),
                    title: title,
                    // image: `assets/images/uploads/posts/${fields.email}/post-${ fields.user_id }-${files.file.name}`,
                    image: `https://chuguev-info-posts-images.s3-us-west-1.amazonaws.com/post-${ userId }-${ filename }`,
                    text: text,
                    tags: tags,
                    likes: [],
                    likeCount: 0,
                    comments: [],
                    commentCount: 0

                }).save();

                // console.log('Add Post post -> ', post);

                fs.unlinkSync(`temp/${ filename }`);

                return post;

                // const keyName = `post-${ userId }-${ filename }`;
            } catch (err) {
                return new Boom(err);
            }
        }
    }
};

export default resolvers;