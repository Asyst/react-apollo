import axios from 'axios';

import User from './user';

const resolvers = {
    ...User.Query,
    ...User.User,
    Mutation: {
        updatedUser: (_, variables, { cache, getCacheKey }) => {
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