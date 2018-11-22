import Post from './post.model';
import User from '../user/user.model';
import Comment from '../comment/comment.model';
import getLogger from '../lib/log';
import Boom from 'boom';
import { dispatchAndRespond } from '../htmlResponse'; 

import { normalize } from 'normalizr';
import * as schema from '../../src/actions/schema';

const log = getLogger(module);

export const fetchPosts = async (request, h) => {
    try {
        const posts = await Post.find().limit(10).exec();
        const postsCount = await Post.count().exec();

        // console.log('posts -> ', posts);
        console.log('postsCount -> ', postsCount);

        if (!posts.length) {
            // return h({ error: 'Нет публикаций' });
        }
    
        request.context = {
            posts: posts.map((post) => {
    
                return {
                    id: post.id,
                    // author_id: post.author_id,
                    author: post.author,
                    // author_avatar: users[idx].user_id && users[idx].user_id === post.author_id && users[idx].avatar,
                    date: post.date,
                    title: post.title,
                    image: post.image,
                    text: post.text,
                    tags: post.tags,
                    likes: post.likes,
                    likeCount: post.likeCount,
                    comments: post.comments,
                    commentCount: post.commentCount
                };
            })
        };
    
        // const normalizedResponse = normalize(request.context.posts, schema.postListSchema);
    
        // const action = { type: 'FETCH_POSTS_SUCCESS', payload: { posts: normalizedResponse, postsCount } };
    
        // return dispatchAndRespond(request, h, action);

        return h.response(request.context.post);
    }
    catch(err) {
        return new Boom(err);
    }

};

export const loadMoreHandler = async (request, h) => {

    try {
        const posts = await Post.find().skip(Number(request.params.offset)).limit(10).exec();

        request.context = {
            posts: posts.map((post) => {

                return {
                    id: post.id,
                    // author_id: post.author_id,
                    author: post.author,
                    // author_avatar: users[idx].user_id && users[idx].user_id === post.author_id && users[idx].avatar,
                    date: post.date,
                    title: post.title,
                    image: post.image,
                    text: post.text,
                    tags: post.tags,
                    likes: post.likes,
                    likeCount: post.likeCount,
                    comments: post.comments,
                    commentCount: post.commentCount
                };
            })
        }

        const normalizedResponse = normalize(request.context.posts, schema.postListSchema);
    
        console.log('normalizedResponse -> ', normalizedResponse);
        const action = { type: 'LOAD_MORE_SUCCESS', payload: { posts: normalizedResponse } };
    
        return dispatchAndRespond(request, h, action);
    }
    catch(err) {
        return new Boom(err);
    }
    
};

export const postHandler = async (req, h) => {    
    const postId = req.params.post_id;

    try {
        const post = await Post.findById(postId).exec();
        const comments = await Comment.find({ post_id: postId }).populate('commenter');

        post.comments = comments;

        const action = { type: 'FETCH_POST_SUCCESS', payload: { post } }; 

        return dispatchAndRespond(req, h, action);
    }
    catch(e) {
        log.error(`get posts error -> `, err);
        return h.response(err);
    }
}

export const fetchComments = async (req, h) => {
    console.log('fetchComments -> ', req.payload);

    const query = Comment.find({ 'post_id': req.payload.postId });
    let comments;
    
    try {
        comments = await query.exec();
    }
    catch(err) {
        log.error(`get posts error -> `, err);
        return new Boom(err);
    }

    const normalizedResponse = normalize(comments, schema.commentsListSchema);

    console.log('fetchComments -> ', normalizedResponse );

    const action = { type: 'FETCH_COMMENTS_SUCCESS', payload: { ...normalizedResponse } };   
    return dispatchAndRespond(req, h, action);
}

export const postsRoutesMap = (router) => {
    

    

    router.get('/post/:post_id', (req, res) => {
        if (req.xhr) {
            
            Post
                .find()
                .where('id', req.params.post_id)
                .exec((err, post) => {
                    if (err) {
                        log.error(`get posts error -> ${err}`);
                        res.send(err);
                    }

                    res
                        .status(200)
                        .set('Content-Type', 'application/json')
                        .send(post);
                })
        }
    });
}