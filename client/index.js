import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'mobx-react';
// import ApolloClient from "apollo-boost";
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';
import { ApolloLink, Observable } from 'apollo-link';
import { toIdValue } from 'apollo-utilities';
import { ApolloProvider } from "react-apollo";
import defaults from "./defaults";
import typeDefs from './graphql/schema';
import resolvers from "./graphql/resolvers";
import axios from 'axios';

import registerServiceWorker from './registerServiceWorker';

// import newsFeedStore from './stores/newsFeedStore';

import App from './App';

window.React = React;

// const typeDefs = `
//     type Post {
//         id: String
//         author: String
//         date: String
//         title: String,
//         image: String,
//         text: String,
//         tags: String,
//         likes: [String],
//         comments: [String]
//     }
// `;

const cache = new InMemoryCache({
    dataIdFromObject: object => object.key || null,
    cacheRedirects: {
      Query: {
        post: (_, { id }, { getCacheKey }) => getCacheKey({ __typename: 'Post', id }),
        currentUser: (_, args, { getCacheKey }) => {
            console.log('cacheRedirects -> ', args);

            return 'User';
        }
      }
    }
});

const request = async (operation) => {
    const token = await AsyncStorage.getItem('token');
    operation.setContext({
        headers: {
            authorization: token
        }
    });
};

const requestLink = new ApolloLink((operation, forward) =>
    new Observable(observer => {
        let handle;

        Promise.resolve(operation)
            .then(oper => request(oper))
            .then(() => {
                handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
                });
            })
        .catch(observer.error.bind(observer));

        return () => {
            if (handle) handle.unsubscribe();
        };
    })
);
  
const client = new ApolloClient({
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.map(({ message, locations, path }) =>
                    console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
                );
            }
            
            if (networkError) console.log(`[Network error]: ${networkError}`);
        }),
        withClientState({
            defaults,
            typeDefs,
            resolvers,
            cache
        }),
        new HttpLink({
            uri: `${window.location.origin}/graphql`,
            credentials: 'same-origin'
        })
    ]),
    cache
});

render(
    <ApolloProvider client={ client }>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
);

registerServiceWorker();