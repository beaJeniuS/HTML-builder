const path = require('path');
const fs = require('fs');

const srcFolder = path.join(__dirname, 'styles');
const destFolder = path.join(__dirname, 'project-dist');

/*function makeBundle(srcFolder, destFolder) {
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
}*/

function makeBundle(srcFolder, destFolder) {
  let files = [];
  fs.createWriteStream(path.join(destFolder, 'bundle.css')).end();
  fs.readdir(srcFolder, { withFileTypes: true }, (error, fileList) => {
    if (error) throw error;
    fileList.forEach(file => { 
      if (path.parse(file.name).ext.slice(1) === 'css') {
        files.push(fs.promises.readFile(path.join(srcFolder, file.name)));
      }
    });
    
    Promise.all(files).then(data => {
      const writeStream = fs.createWriteStream(path.join(destFolder, 'bundle.css'));

      let tmpStr = '';
      data.forEach(element => {
        tmpStr += element.toString() + '\n';
      });

      writeStream.write(tmpStr, (err) => {
        if (err) throw err;
      });

      writeStream.end();
    }).catch(err => {
      console.log('Произошла ошибка: ', err);
    });    
  });
}

makeBundle(srcFolder, destFolder);

