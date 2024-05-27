const fs = require('fs');



exports.read = async (filePath) => {
  return (await fs.promises.exists(filePath)) ? (await fs.promises.readFile(filePath)).toString() : undefined;
}

exports.readAsJs = (filePath) => {
  return (await fs.promises.exists(filePath)) ? require(process.cwd() + '/' + filePath) : undefined;
}

exports.readAsJson = async (filePath) => {
  return (await fs.promises.exists(filePath)) ? JSON.parse(await fs.promises.readFile(filePath)) : undefined;
}



exports.write = async (filePath, data) => {
  let i = filePath.lastIndexOf('/');
  if(i != -1) {
    let dir = filePath.substring(0, i);
    if(!(await fs.promises.exists(dir)))
      await fs.promises.mkdir(dir, { recursive: true });
  }
  await fs.promises.writeFile(filePath, data);
}
