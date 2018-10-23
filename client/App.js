import { PureComponent, Fragment } from 'react';
import { BrowserRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { ApolloConsumer, Mutation } from "react-apollo";
import gql from 'graphql-tag';
import firebase from 'firebase';

import NewsFeed from './components/NewsFeed';
import UsersList from './components/UsersList';
import Profile from './components/Profile';
// import Post from './components/Post';

import credentials from './credentials';

const FETCH_USER = gql`
  query {
    fetchUser @client {
      id
      displayName
      photoURL
    }
  }
`;

const config = {
    apiKey: credentials.apiKey,
    authDomain: credentials.authDomain,
    databaseURL: credentials.databaseURL,
    projectId: credentials.projectId,
    storageBucket: credentials.storageBucket,
    messagingSenderId: credentials.messagingSenderId
};

class App extends PureComponent {
    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const [userData] = user.providerData;
                // User is signed in.
                console.log(`onAuthStateChanged render user -> `, userData);
                // fetchUser(userInfo);
            } else {
                // No user is signed in.
            }
        });
        
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
        firebase.initializeApp(config);

        console.log(`App render -> `, this);

        return <ApolloConsumer>
            {(client) => {
                console.log('ApolloConsumer -> ', client);

                return <Fragment>
                    <Switch>
                        <Route exact path="/" render={ () => <Redirect to="/feed" /> } />
                        <Route path="/feed" component={ NewsFeed } />
                        <Route path="/users" component={ UsersList } />
                        <Route path="/profile/:userId" component={ Profile } />
                    </Switch>
                </Fragment>
            }}
        </ApolloConsumer>
    }
}

export default App;