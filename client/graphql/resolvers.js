// resolver signature -> fieldName(obj, args, context, info) { result }

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
        // posts: async () => await Post.find().exec(),
        // comments: async () => await Comment.find().exec(),
        // books: () => books,
        currentUser: (obj, args, { cache }, info) => {
            console.log('currentUser obj -> ', obj);
            console.log('currentUser args -> ', args);
            console.log('currentUser cache -> ', cache.getCacheKey({ __typename: 'User' }));

            return obj;
        }
    },
    Mutation: {
        updatetUser: (_, variables, { cache, getCacheKey }) => {
            console.log('updatetUser variables -> ', variables);
        }
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