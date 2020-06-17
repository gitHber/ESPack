const crypto = require("crypto");

module.exports = function (content) {
  const hash = crypto.createHash("sha256");
  hash.update(content);
  return hash.digest("hex");
};
