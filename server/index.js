import { ApolloServer, gql } from 'apollo-server-hapi';
import Hapi from 'hapi';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

import coonectDB from './db/connectDB';

async function StartServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const app = new Hapi.server({
    port: 3000,
    host: 'localhost'
  });

    await app.register(require('inert'));
    await app.register({
        plugin: require('hapi-pino'),
        options: {
            logEvents: ['response']
        }
    })

  await server.applyMiddleware({
    app,
  });

  app.route({
      method: 'GET',
      path: '/',
      handler: (request, h) => {
          return h.file('../public/index.html');
      }
  });
  

  await server.installSubscriptionHandlers(app.listener);

  await app.start();
}

StartServer()
    .then(() => coonectDB())
    .catch(error => console.log(error));