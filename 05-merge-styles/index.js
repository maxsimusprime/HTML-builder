const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const mergeStyles = async (source, bundle) => {
  await fsPromises.writeFile(bundle, '');
  try {
    await fsPromises
      .readdir(source)
      .then(files => {
        files.forEach(file => {
          const pathToFile = path.join(source, file)
          const extname = path.extname(pathToFile);
          if (extname === '.css') {
            fsPromises
              .readFile(pathToFile)
              .then(content => {
                fsPromises.appendFile(bundle, content + '\n');
              });
          }
        });
      });
  } catch (err) {
    console.error(err.message);
  }
}

const sourceFolder = path.join(__dirname, 'styles');
const bundleCssFile = path.join(__dirname, 'project-dist', 'bundle.css');

mergeStyles(sourceFolder, bundleCssFile);