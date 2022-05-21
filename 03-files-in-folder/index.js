const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');

const getFileStat = (file) => {
  if (file.isFile()) {
    let fullName = path.join(folderPath, file.name);
    fs.stat(fullName, (err, fileData) => {
      if (err) 
        throw err;
      let fileObj = path.parse(file.name);
      console.log(`${fileObj.name} - ${fileObj.ext.replace('.','')} - ${fileData.size / 1000}kb`);
    });
  }
};

fs.readdir(folderPath, { withFileTypes: true }, (err, data) => {
  if (err)
    throw err;
  else
    data.forEach(getFileStat);
});
