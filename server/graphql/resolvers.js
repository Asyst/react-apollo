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
        comments: async () => await Comment.find().exec(),
        books: () => books,
    },
};

export default resolvers;