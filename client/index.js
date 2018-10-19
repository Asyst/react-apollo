import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'mobx-react';
import ApolloClient from "apollo-boost";
import { toIdValue } from 'apollo-utilities';
import { ApolloProvider } from "react-apollo";
import { defaults, resolvers } from "./graphql/resolvers";
import axios from 'axios';

// import newsFeedStore from './stores/newsFeedStore';

import App from './App';

window.React = React;

const typeDefs = `
    type Post {
        id: String
        author: String
        date: String
        title: String,
        image: String,
        text: String,
        tags: String,
        likes: [String],
        comments: [String]
    }
`;

const authRequest = (operation) => {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');

    provider.setCustomParameters({
        'display': 'popup'
    });

    console.log('request operation -> ', operation);
    console.log('request provider -> ', provider);

    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log('signInWithPopup -> ', result);
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}

const client = new ApolloClient({
    uri: `${window.location.origin}/graphql`,
    clientState: {
    //   defaults,
    //   resolvers,
      typeDefs
    },
    // request: authRequest,
    cacheRedirects: {
        Query: {
            post: (_, { id }, { getCacheKey }) => getCacheKey({ __typename: 'Post', id })
        }
    }
});

render(
    <ApolloProvider client={ client }>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
);