import { Component, Fragment } from 'react';
import { BrowserRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { ApolloConsumer, Mutation } from "react-apollo";
import gql from 'graphql-tag';
import firebase from 'firebase';

import NewsFeed from './components/NewsFeed';
import UsersList from './components/UsersList';
import Profile from './components/Profile';
// import Post from './components/Post';

import credentials from './credentials';

const GET_USER = gql`
    query {
        currentUser {
            uid
            displayName
            photoURL
            email
            phoneNumber
            providerId
        }
    }
    
`;

const config = {
    apiKey: credentials.firebase.apiKey,
    authDomain: credentials.firebase.authDomain,
    databaseURL: credentials.firebase.databaseURL,
    projectId: credentials.firebase.projectId,
    storageBucket: credentials.firebase.storageBucket,
    messagingSenderId: credentials.firebase.messagingSenderId
};

firebase.initializeApp(config);

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
        return <ApolloConsumer>
            {(client) => {
                // const state = client.readFragment({ fragment: GET_USER });

                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        const [userData] = user.providerData;
                        // User is signed in.
                        client.writeData({ data: { currentUser: {...userData} } });
                        console.log(`onAuthStateChanged render user -> `, userData);
                        // fetchUser(userInfo);
                    } else {
                        // No user is signed in.
                    }
                });

                // console.log('ApolloConsumer client -> ', client);
                console.log('ApolloConsumer cache -> ', client);

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