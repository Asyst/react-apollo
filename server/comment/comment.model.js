import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = Schema({
    _id: Schema.Types.ObjectId,
    commenter: { 
        type: Schema.Types.ObjectId, ref: 'User',
        require: true,
        validate: {
            validator: (v) => v !== "undefined"
        }
    },
    post_id: { 
        type: Schema.Types.ObjectId, ref: 'Post',
        require: true,
        validate: {
            validator: (v) => v !== "undefined"
        }
    },
    date: String,
    text: String,
    reply: [String],
    likes: [String],
    likeCount: Number,
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;