var server = {
  url: 'http://localhost/university',
  staticUrl: 'http://localhost/'
  /*url: 'https://boss.tongguxinxi.com/university',
  staticUrl: 'https://boss.tongguxinxi.com/'*/
}

var business = {
  user : {
    login: server.url + '/user/login',
    queryByTeamLeaderNo: server.url + '/user/queryByTeamLeaderNo',
    queryByTeacherNo: server.url + '/user/queryByTeacherNo',
  }, 
  question : {
    list: server.url + '/question/query'
  },
  answer: {
	  save: server.url + '/answer/save',
    saveTeamLeader: server.url + '/answer/saveTeamLeader',
    saveTeacher: server.url + '/answer/saveTeacher',
  },
  attachement: {
    uploadImage: server.url + '/attachement/upload'
  }
};

module.exports.server = server;
module.exports.business = business;