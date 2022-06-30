const AWS = require('aws-sdk');
const fs = require('fs');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._S3 = new AWS.S3();

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: +new Date() + meta.filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    };

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data.Location);
      });
    });
  }

  writeFileLocal(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  removeFile(fileLocation) {
    const pathName = new URL(fileLocation).pathname;
    const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);

    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };

    return new Promise((resolve, reject) => {
      this._S3.deleteObject(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  }
}

module.exports = StorageService;
