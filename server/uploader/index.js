import * as del from 'del';
import * as Loki from 'lokijs';
import fs from 'fs';
import { v4 } from 'uuid';

const loadCollection = (colName, db) => {
    return new Promise(resolve => {
        db.loadDatabase({}, () => {
            const _collection = db.getCollection(colName) || db.addCollection(colName);

            resolve(_collection);
        })
    });
};

const _fileHandler = (file, options) => {
    if (!file) {
        throw new Error('no file');
    }

    const originalname = file.hapi.filename;
    const filename = v4();
    const path = `${options.dest}${filename}`;
    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
        file.on('error', (err) => {
            reject(err);
        });

        file.pipe(fileStream);

        file.on('end', (err) => {
            const fileDetails = {
                fieldname: file.hapi.name,
                originalname: file.hapi.filename,
                filename,
                mimetype: file.hapi.headers['content-type'],
                destination: `${options.dest}`,
                path,
                size: fs.statSync().size
            };

            resolve(fileDetails);
        });
    });
}

const uploader = (file, options) => {
    if (!file) {
        throw new Error('no file(s)');

        return _fileHandler(file, options);
    } 
}

export default {
    loadCollection,
    uploader
};