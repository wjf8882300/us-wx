var server = {
  // url: 'http://localhost/university/wx',
  // staticUrl: 'http://localhost/'
  url: 'https://boss.tongguxinxi.com/university/wx',
  staticUrl: 'https://boss.tongguxinxi.com/'
}

var business = {
  user : {
    apply: server.url + '/user/apply',
    login: server.url + '/user/login',
    query: server.url + '/user/query'
  }, 
  question : {
    list: server.url + '/question/query'
  },
  answer: {
	  save: server.url + '/answer/save',
    saveTeam: server.url + '/answer/saveTeam'
  },
  attachement: {
    uploadImage: server.url + '/attachement/upload'
  }
};

var errorcode = {
  NOT_LOGIN: 9083015
};

module.exports.server = server;
module.exports.business = business;
module.exports.errorcode = errorcode;