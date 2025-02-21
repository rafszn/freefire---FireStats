const fs = require("fs");
function imageToBase64(path, mimetype) {
  const imageBuffer = fs.readFileSync(path);
  const base64Image = imageBuffer.toString("base64");
  return `data:${mimetype};base64,${base64Image}`;
}

module.exports = imageToBase64;
