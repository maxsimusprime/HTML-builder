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

const getHtml = async (file) => {
  let content = '';
  try {
    const readed = await fsPromises.readFile(file, { encoding: 'utf8' });
    content += readed;
  } catch (err) {
    console.error(err.message);
  }
  return content;
}

const replaceAsync = async (str, regex, asyncFn) => {
  const matches = str.match(regex);
  if (matches) {
      const replacement = await asyncFn(...matches);
      str = str.replace(matches[0], replacement);
      str = await replaceAsync(str, regex, asyncFn);
  }
  return str;
}

const insertTemplates = async (template, components, destFile) => {
  const regexp = /[^\n]({{.+?}})/g;
  try {
    await fsPromises
      .readFile(template)
      .then(content => content.toString())
      .then(content => replaceAsync(content, regexp, match => {
        const componentName = match.substring(3, match.length - 2) + '.html';
        const componentHtml = getHtml(path.join(components, componentName));
        return componentHtml;
      }))
      .then(patched => {
        fsPromises.writeFile(destFile, patched);
      })
  } catch (err) {
    console.error(err.message);
  }
}

const buildPage = async () => {
  const projectDist = path.join(__dirname, 'project-dist');
  await fsPromises.rm(projectDist, { force: true, recursive: true });
  await fsPromises.mkdir(projectDist, { recursive: true });

  await copyDir(path.join(__dirname, 'assets'), path.join(projectDist, 'assets'));

  await mergeStyles(path.join(__dirname, 'styles'), path.join(projectDist, 'style.css'));

  await insertTemplates(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'components'),
    path.join(projectDist, 'index.html'),
  );
}

buildPage();

