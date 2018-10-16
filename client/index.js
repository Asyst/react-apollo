import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { defaults, resolvers } from "./graphql/resolvers";

import newsFeedStore from './stores/newsFeedStore';

import App from './App';

window.React = React;

const client = new ApolloClient({
    uri: `https://nx9zvp49q7.lp.gql.zone/graphql`,
    clientState: {
      defaults,
      resolvers
    }
});

const stores = {
    newsFeedStore
};

render(
    <ApolloProvider client={ client }>
        <Provider { ...stores }>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </ApolloProvider>,
    document.getElementById('root')
);