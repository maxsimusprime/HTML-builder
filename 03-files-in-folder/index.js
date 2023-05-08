const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'secret-folder');

const options = { withFileTypes: true };
fs.readdir(pathToDir, options, (err, files) => {
  if (err) console.log(err);
  files.forEach(file => {
    fs.stat(path.join(pathToDir, file.name), (err, stat) => {
      if (err) console.log(err);
      if (stat.isFile()) {
        const extname = path.extname(file.name);
        const name = file.name.split(extname)[0];
        console.log(`${name} - ${extname.slice(1)} - ${stat.size}bytes`);
      }
    });
  });
});