import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const replySchema = Schema({
    _id: Schema.Types.ObjectId,
    commenter: { type: Schema.Types.ObjectId, ref: 'User' },
    comment_id: { type: Schema.Types.ObjectId, ref: 'Comment' },
    date: String,
    text: String,
    likes: [String],
    likeCount: Number,
});

const Reply = mongoose.model('Reply', replySchema);

export default Reply;