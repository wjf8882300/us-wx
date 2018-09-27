var des = require('3des.js');
var base64 = require('base64.js');

/*
 * 解密
 */
function decrypt(data, token, algorithm) {
  if (algorithm == 1) { return JSON.parse(data);} 
  var base64Data = des.decrypt(data, token, null, null);
  var plainData = base64.decode(base64Data);
  return JSON.parse(plainData); 
}

/*
 * 加密
 */
function encrypt(data, token, algorithm) {
  if (algorithm == 1) { return JSON.stringify(data); } 
  var base64Data = base64.encode(JSON.stringify(data));
  var encryptData = des.encrypt(base64Data, token, null, null);
  return encryptData;
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
}  