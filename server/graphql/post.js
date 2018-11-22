import Post from '../post/post.model';

const resolvers = {
    Query: {
        posts: async () => await Post.find().exec(),
        post: async (obj, args, context, info) => await Post.findById(args.id).exec()
    },
    Mutation: {
        addPost: async (parent, { input }, context) => {

            const { author, title, image, text, tags } = input;

            try {
                const userId = author; 
                const [file] = image;
                const filename = file.name;

                const keyName = `post-${ userId }-${ filename }`;

                const f = fs.readFileSync(`temp/${ filename }`);

                // New aws instance
                const s3 = new AWS.S3({
                    apiVersion: '2006-03-01',
                    accessKeyId: credentials.aws_access_key_id,
                    secretAccessKey: credentials.aws_secret_access_key,
                    region: 'us-west-1'
                });

                s3.upload({ 
                    Bucket: 'chuguev-info-posts-images',
                    Key: keyName,
                    Body: f,
                    ACL: 'public-read'
                }, (err) => {
                    if (err) {
                        return new Boom(err);
                    }
                });

                const post = await new Post({
                    _id: new mongoose.Types.ObjectId(),
                    post_id: v4(),
                    author: userId,
                    date: Date.now(),
                    title: title,
                    image: `https://chuguev-info-posts-images.s3-us-west-1.amazonaws.com/post-${ userId }-${ filename }`,
                    text: text,
                    tags: tags,
                    likes: [],
                    likeCount: 0,
                    comments: [],
                    commentCount: 0

                }).save();

                fs.unlinkSync(`temp/${ filename }`);

                return post;
            } catch (err) {
                return new Boom(err);
            }
        }
    }
};

export default resolvers;