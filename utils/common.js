var server = {
  url: 'http://localhost:9999/'
}

var business = {
  user : {
    login: server.url + '/user/login'
  }, 
  question : {
    list: server.url + '/question/query'
  }
};

module.exports.business = business;