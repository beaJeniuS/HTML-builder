const path = require('path');
const fs = require('fs');
const { readdir: rd } = require('fs/promises');
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

async function getFilesInfo() {
  try {
    const fileList = await rd(folderPath, { withFileTypes: true });
    for (const file of fileList)
      getFileStat(file);
  } catch (err) {
    console.error(err);
  }
}

getFilesInfo();
