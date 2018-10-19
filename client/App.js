import { Component, Fragment } from 'react';
import { BrowserRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';

import NewsFeed from './components/NewsFeed';
import UsersList from './components/UsersList';
// import Post from './components/Post';

class App extends Component {
    componentDidMount() {
        // firebase.auth().getRedirectResult()
        //     .then(result => {
        //         console.log(`result -> `, result) 

        //         if (result.credential) {
        //             // saveToken(result.credential.accessToken);
        //             // loginFB(result.additionalUserInfo.profile);
        //         }

        //     })
        //     .catch(err => {
        //         throw new Error(err)
        //     })
    }

    render() {
        return <Fragment>
            <Switch>
                <Route exact path="/" render={ () => <Redirect to="/feed" /> } />
                <Route path="/feed" component={ NewsFeed } />
                <Route path="/users" component={ UsersList } />
            </Switch>
        </Fragment>
    }
}

export default App;