const path = require('path');
const fs = require('fs');

const srcFolder = path.join(__dirname, 'styles');
const destFolder = path.join(__dirname, 'project-dist');


function makeBundle(srcFolder, destFolder) {
  fs.createWriteStream(path.join(destFolder, 'bundle.css')).end();
  fs.readdir(srcFolder, { withFileTypes: true }, (error, fileList) => {
    if (error) throw error;
    fileList.forEach(file => { 
      if (path.parse(file.name).ext.slice(1) === 'css') {
        const readStream = fs.createReadStream(path.join(srcFolder, file.name));
        readStream.on('data', (chunk) => {
          fs.appendFile(path.join(destFolder, 'bundle.css'), chunk.toString(), (err) => {
            if (err) throw err;
          });
        });        
      }
    });
  });
}

makeBundle(srcFolder, destFolder);