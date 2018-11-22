import Comment from '../comment/comment.model';

const resolvers = {
    Query: {
        comments: async () => await Comment.find().exec(),
    }
};

export default resolvers;