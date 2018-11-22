import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import mongoose from 'mongoose';
// import formidable from 'formidable';
import { v4 } from 'uuid';
import passwordHash from 'password-hash';
import Jimp from 'jimp';
import getLogger from '../lib/log';
import Boom from 'boom';

import { normalize } from 'normalizr';
import * as schema from '../../src/actions/schema';

// aws sdk
import AWS from 'aws-sdk';
import { bucketPromise } from '../aws-bucket';

import credentials from '../credentials';
import { sendNotification } from '../utils';

import { dispatchAndRespond } from '../htmlResponse';

import User from './user.model';
import Post from '../post/post.model';
import Comment from '../comment/comment.model';

const userRouter = Router();

const log = getLogger(module);

// userRouter.post('/login', (req, res) => {
//     if (req.xhr) {
//         User
//             .find()
//             .where('email', req.body.email)
//             .exec((err, user) => {
//                 // console.log('login user -> ', user);
//                 // console.log(passwordHash.verify(req.body.password, user[0].password));

//                 if (!passwordHash.verify(req.body.password, user[0].password)) {
//                     res.send({ error: 'Не верный логин или пароль' });
//                 }
//                 else {
//                     const userInfo = user.map(user => user);
//                     req.user = userInfo;
//                     res.status(200).send({ msg: 'Авторизация прошла успешно', isLogged: true, user: req.user });
//                 }
//             });
//     }
// });

userRouter.post('/get_user', (req, res) => {
    if (req.xhr) {
        // console.log('req.body -> ', req.body);

        User
            .find()
            .where('user_id', req.body.user_id)
            .exec((err, user) => {
                const userInfo = user.map(user => user);

                delete userInfo.password;

                // console.log('userInfo -> ', user);

                req.user = userInfo;

                if (req.user) {
                    res.status(200).send({ isLogged: true, user: req.user });
                }
            });
    }
});

// userRouter.post('/get_image_path', (req, res) => {
//     if (req.xhr) {
//         const form = new formidable.IncomingForm();

//         form.parse(req, (err, fields, files) => {
//             if (err) {
//                 log.error(`Error -> ${ err }`);
//             }

//             fs.existsSync('uploads/') || fs.mkdirSync('uploads/');

//             const imagePath = path.resolve(files.file.path);

//             Jimp.read(imagePath, (err, image) => {
//                 const tempUploadPath = path.resolve(`./uploads/images/temp/${fields.nickname}/avatar-${ fields.user_id }-${files.file.name}`);

//                 image.write(tempUploadPath);

//                 res.status(200).send({ imagePath: `images/temp/${fields.nickname}/avatar-${ fields.user_id }-${files.file.name}` });
//             });
//         });
//     }
// });

userRouter.post('/upload_avatar', (req, h) => {

    console.log('add post -> ', req.payload);

    // const oldPath = files.file.path;
    // const uploadPath = path.resolve(`./build/assets/images/uploads/avatars/${ files.file.name }`);

    Jimp.read(oldPath, function (err, image) {
        // do stuff with the image (if no exception)
        if (err) console.log('Jimp err -> ', err);
    
        const newUploadPath = path.resolve(`./uploads/images/avatars/${fields.nickname}/avatar-${ fields.user_id }-${files.file.name}`);

        console.log('image -> ', image.bitmap.width);
        console.log('image -> ', image.bitmap.height);

        image
            .quality(60)
            .resize(image.bitmap.width / 4, image.bitmap.height / 4)
            .contain(250, 250, Jimp.HORIZONTAL_ALIGN_LEFT | Jimp.VERTICAL_ALIGN_TOP)
            .write(newUploadPath);

        // fs.unlinkSync(`./build/assets/images/uploads/avatars/avatar-${--i}-${ fields.user_id }.${ image.getExtension() }`);

        User.findOneAndUpdate({ user_id: fields.user_id }, { avatar: `images/avatars/${fields.nickname}/avatar-${ fields.user_id }-${files.file.name}` }, (err) => {
            if (err) {
                console.log('error -> ', err);
                // res.status(500).send({ error: err });
            }

            // res.status(200).send({ msg: 'Аватар сохраннен!', avatar: `images/avatars/${fields.nickname}/avatar-${ fields.user_id }-${files.file.name}` })
        });
    });

});

export const handleSaveUser = async (request, h) => {
    console.log('save user -> ', request.payload.name);
    console.log('save user -> ', request.payload.id);

    const userData = request.payload;

    const query = User.find({ 'facebookId': userData.id });
    const user = await query.exec();

    log.info('user from DB -> ', user);
    // h.header('X-Frame-Options', 'sameorigin');
    if (!user || !user.length) {
        const user = await new User({
            _id: new mongoose.Types.ObjectId(),
            facebookId: userData.id,
            name: userData.name,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email && userData.email,
            picture: userData.picture.data.url
        }).save();

        console.log('!user -> ', user);

        const action = { type: 'FETCH_USER_DATA_SUCCESS', payload: { user } };
        return dispatchAndRespond(request, h, action);
    }
    else {
        console.log('user -> ', user);

        const action = { type: 'FETCH_USER_DATA_SUCCESS', payload: { user: user[0] } };
        return dispatchAndRespond(request, h, action);
    }
}

export const addPost = async (request, h) => {
    console.log('form -> ', request.payload.file);

    const postData = request.payload;
    const file = postData.file;

    const filename = file.hapi.filename;

    const userId = request.payload.id;

    // const filesPath = path.resolve(`./uploads/images/posts/${fields.nickname}`);

    // fs.existsSync('build/') || fs.mkdirSync('build/');

    // const oldPath = request.payload.file.path;
    // const uploadPath = path.resolve(`./uploads/images/posts/${ files.file.name }`);

    // Jimp.read(oldPath, (err, image) => {
    //     image
    //         .quality(60)   
    //         .resize(640, 480)
    //         .write(oldPath);

    //     console.log('image -> ', image);
    // })

    // const data = fs.readFileSync(oldPath);

    const keyName = `post-${ userId }-${ filename }`;

        // image
        //     .resize(640, 480)
        //     .write(newUploadPath);
        // Create params for putObject call
        // const objectParams = { Bucket: 'chuguev-info-bucket-2716bb67-a497-4fa8-884f-e3d2364c08dd', Key: keyName, Body: files.file };
        // Create object upload promise

    const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        accessKeyId: credentials.aws_access_key_id,
        secretAccessKey: credentials.aws_secret_access_key,
        region: 'us-west-1'
    });

    // Call S3 to list current buckets

    s3.upload({ 
        Bucket: 'chuguev-info-posts-images',
        Key: keyName,
        Body: file,
        ACL: 'public-read'
    }, (err, data) => {
        if (err) {
            console.log("Error uploaded data " + err);
            throw new Error(err)
        }

        console.log("Successfully uploaded data -> ", data);
    });

    try {
        const post = await new Post({
            _id: new mongoose.Types.ObjectId(),
            // id: v4(),
            author: postData.name,
            // author_id: user._id,
            date: Date.now(),
            title: postData.title,
            // image: `assets/images/uploads/posts/${fields.email}/post-${ fields.user_id }-${files.file.name}`,
            image: `https://chuguev-info-posts-images.s3-us-west-1.amazonaws.com/post-${ userId }-${ filename }`,
            text: postData.text,
            tags: postData.tags,
            likes: [],
            likeCount: 0
        }).save();

        console.log('POST -> ', normalize(post, schema.postSchema));

        const normalizedResponse = normalize(post, schema.postSchema);
        const action = { type: 'ADD_POST_SUCCESS', payload: normalizedResponse };
        dispatchAndRespond(request, h, action);

        const data = {
            "notification": {
                "title": "Новая публикация",
                "body": post.title,
                "badge": "/assets/images/logo/logo.png",
                "icon": post.image,
                "click_action" : `https://chuguev-info.com/post/${ post.id }`
            },
            "to" : "/topics/news"
        };

        console.log('data -> ', data);

        const notifyPromise = sendNotification(data);
        const response = await notifyPromise;
        
        return h.response({ msg: 'Новость добавлена', data: response.data });
        // return h.response({ msg: 'Новость добавлена' });
    }
    catch(err) {
        return new Boom(err);
    }
};

export const postComment = async (req, h) => {
    const commentData = req.payload;

    try {
        const comment = await new Comment({
            _id: new mongoose.Types.ObjectId(),
            commenter: commentData.commenter_id,
            post_id: commentData.post_id,
            date: commentData.date,
            text: commentData.text,
            reply: [],
            likes: [],
            likeCount: 0
        }).save();
    
        await Post.findByIdAndUpdate(commentData.post_id, { 
            $push: { comments: comment._id },
            $inc: { commentCount: 1 }
        });

        // console.log('comments -> ', comment);

        const commentsQuery = Comment.find({ post_id: commentData.post_id }).populate('commenter');
        const comments = await commentsQuery.exec();

        console.log('comments -> ', comments);

        const action = { type: 'POST_COMMENT_SUCCESS', payload: { comments } };
        return h.response(action);
        // return dispatchAndRespond(req, h, action);
    }
    catch(err) {
        return new Boom(err);
    }
}

userRouter.post('/user_posts', (req, res) => {
    if (req.xhr) {

        Post
            .find({ author: req.body.nickname })
            .populate('author_id')
            .exec((err, posts) => {
                if (err) log.error(err);

                res.status(200).send({ posts });
            });
    }
});

export const likePost = async (req, h) => {
    const query = Post.findById(req.payload.postId);
    const post = await query.exec();

    const isLiked = post.likes.indexOf(req.payload.userId) !== -1;

    if (isLiked) {
        const likes = post.likes.filter(like => like !== req.payload.userId);

        await Post
            .findById(req.payload.postId)
            .update({ likes })
            .update({ $inc: { likeCount: -1 } })
            .exec();
    }
    else {
        await Post
            .findById(req.payload.postId)
            .update({ $push: { likes: req.payload.userId } })
            .update({ $inc: { likeCount: 1 } })
            .exec();
    }

    const queryForResponse = Post.findById(req.payload.postId);
    const postResponse = await queryForResponse.exec();

    req.context = {
        post: {
            id: postResponse._id,
            // author_id: post.author_id,
            author: postResponse.author,
            // author_avatar: users[idx].user_id && users[idx].user_id === post.author_id && users[idx].avatar,
            date: postResponse.date,
            title: postResponse.title,
            image: postResponse.image,
            text: postResponse.text,
            tags: postResponse.tags,
            likes: postResponse.likes,
            likeCount: postResponse.likeCount
        }
    }

    const normalizedResponse = normalize(req.context.post, schema.postSchema);

    const action = { type: 'LIKE_SUCCESS', payload: { ...normalizedResponse } };

    const actionForResponse = dispatchAndRespond(req, h, action).source;

    console.log('actionForResponse -> ', actionForResponse);

    return h.response({ action: actionForResponse, isLiked });
};

export default userRouter;