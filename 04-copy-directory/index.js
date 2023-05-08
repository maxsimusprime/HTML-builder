const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const copyDir = async (source, dest) => {
  try {
    await fsPromises.rm(dest, { force: true, recursive: true });
    await fsPromises.mkdir(dest, { recursive: true });
    await fsPromises
      .readdir(source, { withFileTypes: true })
      .then(files => {
        files.forEach(file => {
          fs.stat(path.join(source, file.name), (err, stat) => {
            if (err) console.log(err);
            if (stat.isFile()) {
              fsPromises.copyFile(path.join(source, file.name), path.join(dest, file.name));
              console.log(`copied >> ${file.name}`);
            }
            if (stat.isDirectory()) 
              copyDir(path.join(source, file.name), path.join(dest, file.name));
          });
        })
      });
  } catch (err) {
    console.error(err.message);
  }
}

const sourceFolder = path.join(__dirname, 'files');
const destFolder = sourceFolder + '-copy';

copyDir(sourceFolder, destFolder);