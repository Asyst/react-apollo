import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'mobx-react';
import ApolloClient from "apollo-boost";
import { toIdValue } from 'apollo-utilities';
import { ApolloProvider } from "react-apollo";
import defaults from "./defaults";
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

const client = new ApolloClient({
    uri: `${window.location.origin}/graphql`,
    clientState: {
      defaults,
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