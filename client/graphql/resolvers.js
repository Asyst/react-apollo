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

export const defaults = {
    posts: []
};

const resolvers = {
    Query: {
        posts: async () => await Post.find().exec(),
        comments: async () => await Comment.find().exec(),
        books: () => books,
    }
};

// export const resolvers = {
//     Mutation: {
//         toggleTodo: (_, variables, { cache, getCacheKey }) => {
//             const id = getCacheKey({ __typename: 'TodoItem', id: variables.id })
//             const fragment = gql`
//             fragment completeTodo on TodoItem {
//                 completed
//             }
//             `;
//             const todo = cache.readFragment({ fragment, id });
//             const data = { ...todo, completed: !todo.completed };
//             cache.writeData({ id, data });
//             return null;
//         },
//     },
// };

export default resolvers;