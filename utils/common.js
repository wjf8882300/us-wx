var server = {
  url: 'http://localhost/university',
  staticUrl: 'http://localhost/'
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
  },
  attachement: {
    uploadImage: server.url + '/attachement/upload'
  }
};

module.exports.server = server;
module.exports.business = business;