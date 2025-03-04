const path = require('path');
const fs = require('fs');

const srcFolder = path.join(__dirname);
const destFolder = path.join(__dirname, 'project-dist');

let templateText = '';

function copyFolder(srcFolder, destFolder) {
  try {
    fs.mkdir(destFolder, { recursive: true }, (error) => {
      if (error) {
        throw error;
      } 
      fs.readdir(srcFolder, { withFileTypes: true }, (error, fileList) => {
        if (error) throw error;
        fileList.forEach(file => {
          if (file.isFile()) {
            fs.copyFile(path.join(srcFolder, file.name), path.join(destFolder, file.name), () => {});
          } else {
            copyFolder(path.join(srcFolder,file.name), path.join(destFolder,file.name));
          }
        });
      });
    });  
  } catch (err) {
    console.error(err);
  }
}

fs.rm(destFolder, { recursive: true, force: true }, (err) => {
  if (err) throw err;

  fs.mkdir(destFolder, { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.mkdir(path.join(srcFolder, 'assets'), { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.mkdir(path.join(destFolder, 'assets'), { recursive: true }, (err) => {
    if (err) throw err;
  });

  copyFolder(path.join(srcFolder, 'assets'), path.join(destFolder, 'assets'));

  const readStream = fs.createReadStream(path.join(srcFolder, 'template.html'));

  readStream.on('data', (chunk) => {
    templateText += chunk.toString();
  });

  readStream.on('error', (error) => {
    console.log('Произошла ошибка: ', error.message);
  });

  readStream.on('end', () => {
    createHtmlByTemplate(templateText);
  });  

  makeBundle(path.join(srcFolder,'styles'), destFolder);
});

function createHtmlByTemplate(templateText) {
  let htmlText = templateText;
  let tmpHeaders = parseTemplate(templateText);
  let fileTemplates = [];
  let resultObj = {};

  for (let name of tmpHeaders) {
    fileTemplates.push(fs.promises.readFile(path.join(srcFolder, 'components', `${name}.html`), 'utf8'));
  }
  
  Promise.all(fileTemplates).then(data => {
    for (let i = 0; i < tmpHeaders.length; i++){
      resultObj[tmpHeaders[i]] = data[i];
    }
    for (let header of tmpHeaders) { 
      htmlText = htmlText.replace(`{{${header}}}`, resultObj[header]);
    }
    const writeStream = fs.createWriteStream(path.join(destFolder,'index.html'));
    writeStream.write(htmlText, (err) => {
      if (err) throw err;
    });
    writeStream.end();
  }).catch(err => {
    console.log('Произошла ошибка: ', err);
  });
}

function parseTemplate(templateText) {
  return templateText.match(/{{\s*[a-zA-Z]*\s*}}/g).map((el) => el.replace(/{{/g, '').replace(/}}/g, '').trim());
}

function makeBundle(srcFolder, destFolder) {
  let files = [];
  fs.createWriteStream(path.join(destFolder, 'style.css')).end();
  fs.readdir(srcFolder, { withFileTypes: true }, (error, fileList) => {
    if (error) throw error;
    fileList.forEach(file => { 
      if (path.parse(file.name).ext.slice(1) === 'css') {
        files.push(fs.promises.readFile(path.join(srcFolder, file.name)));
      }
    });
    
    Promise.all(files).then(data => {
      const writeStream = fs.createWriteStream(path.join(destFolder, 'style.css'));

      let tmpStr = '';
      data.forEach(element => {
        tmpStr += element.toString() + '\n\n';
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
