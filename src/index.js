const fs = require('fs');



async function ensureDir(filePath) {
  let i = filePath.lastIndexOf('/');
  if(i != -1) {
    let dir = filePath.substring(0, i);
    if(!(fs.existsSync(dir)))
      await fs.promises.mkdir(dir, { recursive: true });
  }
}



exports.list = async (dir) => {

  if(!fs.existsSync(dir))
    return [];

  let paths = [];

  let direntArr = await fs.promises.readdir(dir, { withFileTypes:true });
  for(let dirent of direntArr) {
    if(dirent.name == '.DS_Store')
      continue;
    else if(dirent.isDirectory())
      paths = paths.concat((await exports.list(dir + '/' + dirent.name)).map(path => dirent.name + '/' + path));
    else
      paths.push(dirent.name);
  }

  return paths;

}



exports.exists = (filePath) => {
  return fs.existsSync(filePath);
}



exports.pipe = async (data, filePath) => {
  await ensureDir(filePath);
  await new Promise((resolve, reject) => {
    let file = fs.createWriteStream(filePath);
    file.on('error', reject);
    file.on('finish', resolve);
    data.pipe(file);
  });
}



exports.read = async (filePath) => {
  return fs.existsSync(filePath) ? (await fs.promises.readFile(filePath)).toString() : undefined;
}

exports.readAsJs = async (filePath) => {
  return fs.existsSync(filePath) ? require(process.cwd() + '/' + filePath) : undefined;
}

exports.readAsJson = async (filePath) => {
  return fs.existsSync(filePath) ? JSON.parse(await fs.promises.readFile(filePath)) : undefined;
}



exports.write = async (filePath, data) => {
  await ensureDir(filePath);
  await fs.promises.writeFile(filePath, data);
}



exports.delete = async (path) => {
  if(fs.existsSync(path))
    await fs.promises.rm(path, { recursive:true });
}
