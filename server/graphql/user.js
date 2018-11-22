import User from '../user/user.model';

const resolvers = {
    Query: {
        users: async () => await User.find().exec(),
        user: async (obj, args, context, info) => {
            return await User.find().where('facebookId', args.facebookId).exec();
        },
    }
};

export default resolvers;