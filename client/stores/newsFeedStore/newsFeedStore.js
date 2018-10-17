import { observable, action, computed } from "mobx";
import agent from '../../agent';

class NewsFeedStore {
    @observable posts = [];
    @observable isLoading = false;

    @action fetchPosts() {
        this.isLoading = true;

        return agent.Posts.fetch()
            .then(response => console.log('Posts fetch res -> ', response))
            .finally(action('fetch complete', () => this.isLoading = false))
    }

    get posts() {
        return this.posts;
    }

    set posts(posts) {
        this.posts = posts;
    }
}

export default new NewsFeedStore();