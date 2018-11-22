import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = Schema({
    _id: Schema.Types.ObjectId,
    facebookId: String,
    instagramId: String,
    picture: String,
    username: String,
    first_name: String,
    last_name: String,
    email: String,
    dob: String,
    address: String,
    phone: String,
    password: String
});

const User = mongoose.model('User', userSchema);

export default User;