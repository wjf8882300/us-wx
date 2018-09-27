// pages/question/leader/list.js
const app = getApp();
var common = require('../../../utils/common.js');
var crypt = require('../../../utils/crypt.js');
var validator = require('../../../utils/validator.js');
var network = require('../../../utils/network.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    studentList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.localData.questionList = [];
    this.localData.studentList = [];
    this.queryQuestion('努力加载试题中');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.localData.start = 1;
    this.localData.questionList = [];
    this.queryQuestion('努力加载试题中');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.localData.hasMoreData) {
      this.queryQuestion('加载更多数据');
    } 
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  queryQuestion: function(message) {
    var that = this;
    network.requestLoading(
      common.business.question.list,
      {
        start: that.localData.start,
        length: that.localData.length,
        token: app.globalData.token
      },
      message,
      function (res) {
        if (!res) { return; }
        var data = crypt.decrypt(res, app.globalData.token, app.globalData.algorithm);
        if (data.list) {
          if (that.localData.start < data.pages) {
            that.localData.start += 1;
            that.localData.hasMoreData = true;
          } else {
            that.localData.hasMoreData = false;
          }
          that.localData.questionList = that.localData.questionList.concat(data.list);

          // 查询学生
          that.queryStudent();
        }
      });
  },

  queryStudent: function (that) {
    var that = this;
    network.requestLoading(
      common.business.user.query,
      {
        token: app.globalData.token
      },
      '努力加载学生中',
      function (res) {
        if (!res) { return; }
        var data = crypt.decrypt(res, app.globalData.token, app.globalData.algorithm);
        if (data) {
          that.localData.studentList = data;

          that.setData({
            questionList: that.localData.questionList,
            studentList: that.localData.studentList
          });
        }
      });
  }, 

  localData: {
    questionList: [],
    studentList: [],
    result: [],
    start: 1,
    length: 10,
    hasMoreData: true
  },

 /**
 * 填写评分值
 */
  bindKeyInput: function (e) {
    var value = e.detail.value;
    var result = this.localData.result;

    // id结构为"题目索引#学生ID"
    var index = e.target.id;
    var ids = index.split('#');
    var questionPos = ids[0];
    var studentId = ids[1];
    var selectedItem = this.localData.questionList[questionPos];
    var score = selectedItem.questionScore;
    var id = selectedItem.id;
    var item = {
      questionPos: questionPos,
      questionId: id,
      destUserId: studentId,
      answer: value
    };

    // 值为空表示删除
    if (item.answer == '') {
      validator.remove(result, item, function (a, b) { return a.questionId == b.questionId && a.destUserId == b.destUserId; });
      return;
    }

    // 判断用户输入的是否为数字
    if (!validator.isDigest(item.answer)) { return; }

    // 判断填写的分值是否符合规则
    if (!validator.scoreRange(item.answer, 0, score)) { return; }

    // 检查是否是修改已经提交的值，是则修改（通过questionId和destUserId判断）
    validator.merge(result, item,
      function (a, b) { return a.questionId == b.questionId && a.destUserId == b.destUserId; }, function (a, b) { a.answer = b.answer; });
  },

	/**
	 * 提交记录
	 */
  next: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认提交积分考核？',
      success: function (res) {
        if (res.confirm) {

          var result = that.localData.result;

          // 统计答题情况
          var list = [];
          for (var i = 0; i < result.length; i++) {
            var item = { questionPos: result[i].questionPos, questionId: result[i].questionId, size: 1 };
            
            validator.merge(list, item,
              function (a, b) { return a.questionId == b.questionId; }, function (a, b) { a.size += 1; }); 
          }

          // 验证答题数跟题目数是否一致
          if (list.length != that.localData.questionList.length) {
            wx.showToast({
              title: '题目未全部答完，不允许提交',
              icon: 'fail',
              duration: 1000,
              mask: true
            });
            return;
          }

          // 检查是否给所有的学生都已评分
          for (var i = 0; i < list.length; i++) {
            if (list[i].size != that.localData.studentList.length) {
              wx.showToast({
                title: '第' + (list[i].questionPos + 1) + '道题未填完',
                icon: 'fail',
                duration: 1000,
                mask: true
              });
              return;
            }
          }

          that.submitAnswer();
        }
      }
    });
  },

  submitAnswer:function() {
    var result = crypt.encrypt(this.localData.result, app.globalData.token, app.globalData.algorithm);

    network.requestLoading(
      common.business.answer.saveTeam,
      {
        result: result,
        token: app.globalData.token
      },
      '正在提交请稍后',
      function (res) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000,
          mask: true
        });
        wx.navigateTo({
          url: '../../result/result'
        });
      }
    );
  }
})