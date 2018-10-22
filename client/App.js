import { PureComponent, Fragment } from 'react';
import { BrowserRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Mutation } from "react-apollo";
import gql from 'graphql-tag';
import firebase from 'firebase';

import NewsFeed from './components/NewsFeed';
import UsersList from './components/UsersList';
import Profile from './components/Profile';
// import Post from './components/Post';

const FETCH_USER = gql`
  mutation FetchUser($user: User!) {
    fetchUser(user: $user) {
      id
      displayName
      photoURL
    }
  }
`;

const config = {
    apiKey: "AIzaSyDnuxqmvPg-FQRw6PPBkUCKOzym3oQSPSI",
    authDomain: "chuguev-info.firebaseapp.com",
    databaseURL: "https://chuguev-info.firebaseio.com",
    projectId: "chuguev-info",
    storageBucket: "chuguev-info.appspot.com",
    messagingSenderId: "201069311016"
};

class App extends PureComponent {
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
        firebase.initializeApp(config);

        console.log(`App render -> `, this);

        return <Mutation 
            mutation={ FETCH_USER }
            update={(cache, { data }) => {
                console.log(`Mutation update cache -> `, cache);
            }}>
            {(fetchUser, { data }) => {
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        const [userInfo] = user.providerData;
                        // User is signed in.
                        console.log(`onAuthStateChanged render user -> `, userInfo);
                        // fetchUser(userInfo);
                    } else {
                        // No user is signed in.
                    }
                });

                return <Fragment>
                    <Switch>
                        <Route exact path="/" render={ () => <Redirect to="/feed" /> } />
                        <Route path="/feed" component={ NewsFeed } />
                        <Route path="/users" component={ UsersList } />
                        <Route path="/profile/:userId" component={ Profile } />
                    </Switch>
                </Fragment>
            }}
        </Mutation>
    }
}

export default App;