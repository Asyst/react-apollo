import { Component, Fragment } from 'react';
import { BrowserRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { ApolloConsumer, Mutation, graphql } from "react-apollo";
import gql from 'graphql-tag';
import firebase from 'firebase';

import NewsFeed from './components/NewsFeed';
import UsersList from './components/UsersList';
import Profile from './components/Profile';
// import Post from './components/Post';

import credentials from './credentials';

const GET_USER = gql`
    query {
        currentUser @client {
            uid
            displayName
            photoURL
            email
            phoneNumber
            providerId
        }   
    }
`;

const UPDATE_USER = gql`
    mutation updateUserData($userData: User!) {
        updatetUser(userData: $userData) {
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
        const { data } = this.props;

        console.log('componentDidMount -> ', this);

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const [userData] = user.providerData;
                // User is signed in.
                // client.writeQuery({ 
                //     query: GET_USER, 
                //     data: { currentUser: {...userData} } 
                // });
                // const { currentUser } = cache.readQuery({ query: GET_USER });

                data.updateQuery((previousResult) => {
                    console.log('updateQuery previousResult -> ', previousResult);

                    return {
                        ...previousResult,
                        currentUser: {
                            ...previousResult.currentUser,
                            ...userData
                        },
                    }
                });

                // updatetUser(userData);
                // cache.writeQuery({
                //     query: GET_USER,
                //     data: { currentUser: todos.concat([addTodo]) }
                // });

                // console.log(`onAuthStateChanged currentUser -> `, currentUser);
                console.log(`onAuthStateChanged userData -> `, userData);
                // fetchUser(userInfo);
            } else {
                // No user is signed in.
            }
        });
    }

    render() {
        return <Mutation 
            mutation={ UPDATE_USER } >
            {({ data }) => {
                // const state = client.readFragment({ fragment: GET_USER });
                // console.log('ApolloConsumer client -> ', client);
                // console.log('ApolloConsumer cache -> ', client.readQuery({ query: GET_USER }));

                return <Fragment>
                    <Switch>
                        <Route exact path="/" render={ () => <Redirect to="/feed" /> } />
                        <Route path="/feed" component={ NewsFeed } />
                        <Route path="/users" component={ UsersList } />
                        <Route path="/profile" component={ Profile } />
                        <Route path="/profile/:userId" component={ Profile } />
                    </Switch>
                </Fragment>
            }}
        </Mutation>
    }
}

export default graphql(GET_USER)(App);