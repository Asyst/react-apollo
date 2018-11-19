import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { ApolloServer } from 'apollo-server-hapi';
import Hapi from 'hapi';
import hapiBoomDecorators from 'hapi-boom-decorators';
import Loki from 'lokijs';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

import routes from './routes';

import coonectDB from './db/connectDB';

import { loadCollection, uploader } from './uploader';

const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: 'example.com' },
    development: { ssl: false, port: 4000, hostname: 'localhost' }
}

const environment = process.env.NODE_ENV || 'production'

// Loki settings

const DB_NAME = 'uploads.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const fileOptions = { dest: `${UPLOAD_PATH}/` };
const db = new Loki(`${UPLOAD_PATH}/${DB_NAME}`, { persistenceMethod: 'fs' });

if (!fs.existsSync(UPLOAD_PATH)) fs.mkdirSync(UPLOAD_PATH);

async function StartServer() {
    const server = new ApolloServer({ typeDefs, resolvers });

    const app = new Hapi.server({
        port: 4000,
        host: 'localhost',
        routes: { cors: true }
    });

    await app.register(require('inert'));
    await app.register(hapiBoomDecorators);
    await app.register({
        plugin: require('hapi-pino'),
        options: {
            logEvents: ['response'],
            prettyPrint: true
        }
    });

    await server.applyMiddleware({
        app,
    });

    routes.forEach(route => app.route(route));

    app.route({
        method: 'POST',
        path: '/profile',
        config: {
            payload: {
                output: 'stream',
                allow: 'multipart/form-data' //important
            }
        },
        handler: async (request, h) => {
            try {
                const data = request.payload;
                const file = data['avatar'];

                // save the file
                const fileDetails = await uploader(file, fileOptions);

                // save file to database
                const col = await loadCollection(COLLECTION_NAME, db);
                const result = col.insert(fileDetails);

                db.saveDatabase();

                // return result
                return h.response({
                    id: result.$loki,
                    fileName: result.filename,
                    originalName: result.originalname
                });

            } catch(err) {
                return h.badRequest(err.message, err);
            }
        }
    });

    await server.installSubscriptionHandlers(app.listener);

    await app.start();
}

StartServer()
    .then(() => coonectDB())
    .catch(error => console.log(error));