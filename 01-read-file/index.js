const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath);
readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});

readStream.on('error', (error) => {
  console.log('Произошла ошибка: ', error.message);
});