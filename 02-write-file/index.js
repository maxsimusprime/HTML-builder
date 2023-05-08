const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;
const pathToFile = path.join(__dirname, 'text.txt');

fs.writeFile(pathToFile, '', err => {
  if (err) stdout.write(err);
});

process.on('exit', () => stdout.write('Bye!'));
process.on('SIGINT', () => process.exit());

stdout.write('Please enter your text message or "exit"\n');
stdin.on('data', data => {
  const text = data.toString();
  if (text.trim() === 'exit') {
    process.exit();
  }
  fs.appendFile(pathToFile, data, err => {
    if (err) stdout.write(err);
  });
});
