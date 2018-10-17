import { URL } from 'url';
import { ApolloServer } from 'apollo-server-hapi';
import Hapi from 'hapi';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

import coonectDB from './db/connectDB';

const { host, hostname, port } = new URL('http://localhost:3000');

const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: 'example.com' },
    development: { ssl: false, port: 4000, hostname: 'localhost' }
}

const environment = process.env.NODE_ENV || 'production'

async function StartServer() {
    const server = new ApolloServer({ typeDefs, resolvers });

    const app = new Hapi.server({
        port: 4000,
        host: 'localhost'
    });

    await app.register(require('inert'));
    await app.register({
        plugin: require('hapi-pino'),
        options: {
            logEvents: ['response'],
            prettyPrint: true
        }
    })

    await server.applyMiddleware({
        app,
    });

    app.route({
        method: 'GET',
        path: '/bundle.js',
        handler: {
            file: {
                path: './build/bundle.js',
                filename: 'bundle.js', // override the filename in the Content-Disposition header
                mode: 'attachment', // specify the Content-Disposition is an attachment
                lookupCompressed: true // allow looking for script.js.gz if the request allows it
            }
        }
    });

    app.route({
        method: 'GET',
        path: '/assets/css/bundle.css',
        handler: {
            file: {
                path: './build/assets/css/bundle.css',
                filename: 'bundle.css', // override the filename in the Content-Disposition header
                mode: 'attachment', // specify the Content-Disposition is an attachment
                lookupCompressed: true // allow looking for script.js.gz if the request allows it
            }
        }
    });

    // app.route({
    //     method: 'GET',
    //     path: '/bundle.js',
    //     handler: (request, h) => {

    //         return h.file('/bundle.js')
    //             .header('content-type', 'application/javascript');
    //     }
    // });

    app.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.file('./build/index.html')
                .header('content-type', 'text/html');

            // return 'hello !';
        }
    });
  

    await server.installSubscriptionHandlers(app.listener);

    await app.start();
}

StartServer()
    .then(() => coonectDB())
    .catch(error => console.log(error));