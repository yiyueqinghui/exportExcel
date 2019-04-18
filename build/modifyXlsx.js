var fs = require('fs');
function copyIt(from, to) {
  console.log("-------写入cpexcel.js---------")
  fs.writeFileSync(to, fs.readFileSync(from));
}

module.exports = {
  copyIt
}
