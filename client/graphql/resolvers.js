// resolver signature -> fieldName(obj, args, context, info) { result }
import axios from 'axios';

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
        },
        // fetchUserPhoto: async (obj, args, { cache }, info) => {
        //     // console.log('currentUser obj -> ', axios.get(`https://graph.facebook.com/${args.uid}/picture?width=120&height=120`));
        //     const userPicture = await axios.get(`https://graph.facebook.com/v3.2/${args.uid}/picture?type=large`);

        //     console.log('fetchUserPhoto cache -> ', cache);
        //     console.log('fetchUserPhoto userPicture -> ', userPicture);
            
        //     return userPicture;
        // }
    },
    User: {
        photoURL: parent => {
            const { facebookId } = parent;

            console.log('user -> ', facebookId);

            return axios.get(`https://graph.facebook.com/v3.2/${facebookId}/picture?type=large`)
            .then(response => response.data.url);
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