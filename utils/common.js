var server = {
  url: 'http://localhost:9999/'
}

var business = {
  user : {
    login: server.url + '/user/login'
  }, 
  question : {
    list: server.url + '/question/query'
  },
  answer: {
	save: server.url + '/answer/save' 
  }
};

module.exports.business = business;