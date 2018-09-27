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

function isDigest(str) {
  // 判断用户输入的是否为数字
  var regNum = new RegExp('[0-9]', 'g');
  var rsNum = regNum.exec(str);
  if (!rsNum) {
    wx.showToast({
      title: '必须输入数字',
      icon: 'fail',
      duration: 1500,
      mask: true
    });
    return false;
  }
  return true;
}

function scoreRange(str, start, end) {
  if (str < start) {
    wx.showToast({
      title: '分值不能小于0',
      icon: 'fail',
      duration: 1500,
      mask: true
    });
    return false;
  } else if (str > end) {
    wx.showToast({
      title: '分值不能大于' + end,
      icon: 'fail',
      duration: 1500,
      mask: true
    });
    return false;
  }
  return true;
}

function remove(result, item, compare) {
  for (var i = 0; i < result.length; i++) {
    if (compare(result[i], item)) {
      result.splice(i, 1);
      break;
    }
  }
}

function merge(result, item, compare, callback) {
  var isFound = false;
  for (var j = 0; j < result.length; j++) {
    if (compare(result[j], item)) {
      callback(result[j], item);
      isFound = true;
      break;
    }
  }

  if (!isFound) {
    result.push(item);
  }
}

function match(result, item, compare, callback) {
  for (var i = 0; i < result.length; i++) {
    if (compare(result[i], item)) {
      callback(result[i], item);
      break;
    }
  }
}

module.exports = {
  checkPassword: checkPassWord,
  isDigest: isDigest,
  scoreRange: scoreRange,
  remove: remove,
  merge: merge,
  match: match
}  
