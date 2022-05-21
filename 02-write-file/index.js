const path = require('path');
const fs = require('fs');
const readline = require('readline');
const myProcess = require('process');

const filePath = path.join(__dirname, 'usermessages.txt');
const writeStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let prompt = 'What do you want to write to the file? ';
rl.setPrompt(prompt);
rl.prompt();

rl.once('line', () => {
  prompt = 'Anything else? ';
  rl.setPrompt(prompt);
});

rl.on('line', (line) => {
  if (line === 'exit')
    myProcess.exit();
  else {
    writeStream.write(`${line}\n`);
    rl.prompt();
  }
});

myProcess.on('exit', () => {
  console.log('\nGood buy! See you later');
});
