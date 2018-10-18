import { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';

import NewsFeed from './components/NewsFeed';
// import Post from './components/Post';


@withRouter
class App extends Component {
    render() {
        return <Fragment>
            <Switch>
                <Route exact path="/" component={ NewsFeed } />
                <Route path="/feed" component={ NewsFeed } />
                {/* <Route path="/:id" component={ Post } /> */}
            </Switch>
        </Fragment>
    }
}

export default App;