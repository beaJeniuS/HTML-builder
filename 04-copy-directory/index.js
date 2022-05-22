const path = require('path');
const fs = require('fs');

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

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
            copyFolder(path.join(srcFolder,file.name));
          }
        });
      });
    });  
  } catch (err) {
    console.error(err);
  }
}

copyFolder(srcFolder, destFolder);

