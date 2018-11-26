

const resolvers = {
    Query: {
        currentUser: (obj, args, { cache }, info) => {
            return obj;
        }
    },
    User: {
        photoURL: parent => {
            const { facebookId } = parent;

            return axios.get(`https://graph.facebook.com/v3.2/${facebookId}/picture?type=large`)
            .then(response => response.data.url);
        }
    },
};

export default resolvers;