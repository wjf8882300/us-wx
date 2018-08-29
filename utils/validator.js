/*必须为字母加数字*/
function checkPassWord(password) {
  var str = password;
  if (str == null) {
    return false;
  }
  var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
  if (!reg1.test(str)) {
    return false;
  }

  return true;
}

module.exports = {
  checkPassword: checkPassWord
}  
