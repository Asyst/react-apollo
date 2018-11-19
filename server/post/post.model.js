import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = Schema({
    _id: Schema.Types.ObjectId,
    author: {
        type: String,
        require: true,
        validate: {
            validator: (v) => v !== "undefined"
        }
    },
    date: String,
    title: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    images: [String],
    text: String,
    tags: String,
    likes: [String],
    likeCount: Number,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    commentCount: Number
});

const Post = mongoose.model('Post', postSchema);

export default Post;