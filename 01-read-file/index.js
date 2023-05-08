const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(pathToFile, 'utf-8');
const { stdout } = process;

stream.on('data', data => stdout.write(data));
stream.on('error', error => stdout.write(error));
