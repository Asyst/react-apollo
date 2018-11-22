import axios from 'axios';

const Profile = {
    fetchProfilePicture: (uid) => axios.get(`https://graph.facebook.com/${uid}/picture?width=120&height=120`)
};

export default {
    Posts
};