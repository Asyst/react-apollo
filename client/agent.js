import axios from 'axios';

const Posts = {
    fetch: () => axios.get('/posts')
};

export default {
    Posts
};