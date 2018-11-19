import fs from 'fs';
import Boom from 'boom';
export default [
    {
        method: 'GET',
        path: '/sw.js',
        handler: {
            file: {
                path: './build/sw/sw.js',
                filename: 'sw.js', // override the filename in the Content-Disposition header
                mode: 'attachment', // specify the Content-Disposition is an attachment
                lookupCompressed: true // allow looking for script.js.gz if the request allows it
            }
        }
    },
    {
        method: 'GET',
        path: '/bundle.js',
        handler: {
            file: {
                path: './build/bundle.js',
                filename: 'bundle.js',
                mode: 'attachment',
                lookupCompressed: true
            }
        }
    },
    {
        method: 'GET',
        path: '/assets/css/bundle.css',
        handler: {
            file: {
                path: './build/assets/css/bundle.css',
                filename: 'bundle.css',
                mode: 'attachment',
                lookupCompressed: true
            }
        }
    },
    {
        method: 'GET',
        path: '/assets/images/logo/logo.png',
        handler: {
            file: {
                path: './build/assets/images/logo/logo.png',
                filename: 'logo.png',
                mode: 'attachment',
                lookupCompressed: true
            }
        }
    },
    {
        method: 'GET',
        path: '/{path}/{id?}',
        handler: (request, h) => {
            return h.file('./build/index.html');
        }
    },
    {
        method: 'POST',
        path: '/upload',
        config: {
            payload: {
                output: 'stream',
                allow: 'multipart/form-data' //important
            }
        },
        handler: (request, h) => {
            const { file } = request.payload;

            // console.log('Upload -> ', file);
            console.log('Upload -> ', file._data);

            try {
                fs.existsSync('temp/') || fs.mkdirSync('temp/');

                fs.writeFileSync(`temp/${ file.hapi.filename }`, file._data);
            } catch(err) {
                console.log('Error -> ', err);

                return new Boom(err);
            }

            return h.response('success!');
        }
    }
];