import { Component, Fragment } from 'react';
import { BrowserRouter, Route, withRouter } from 'react-router-dom';

import NewsFeed from './components/NewsFeed';

@withRouter
class App extends Component {
    render() {
        return <Fragment>
            <Route path="/" component={ NewsFeed } />
            <Route path="/feed" component={ NewsFeed } />
        </Fragment>
    }
}

export default App;