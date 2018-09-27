// pages/question/student/list.js
const app = getApp();
var common = require('../../../utils/common.js');
var crypt = require('../../../utils/crypt.js');
var validator = require('../../../utils/validator.js');
var network = require('../../../utils/network.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data : {
		list : [],
		result : []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad : function(options) {
    this.localData.questionList = [];
		this.queryQuestion('努力加载试题中');
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady : function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow : function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide : function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload : function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh : function() {
    this.localData.start = 1;
    this.localData.questionList = [];
    this.queryQuestion('努力加载试题中');
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom : function() {
      if(this.localData.hasMoreData) {
        this.queryQuestion('加载更多数据');
      } 
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage : function() {

	},

  localData: {
    questionList: [],
    result: [],
    start: 1,
    length: 10,
    hasMoreData: true
  },

  /* 
   * 查询问题
   */
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
        if(!res) {return;}
        var data = crypt.decrypt(res, app.globalData.token, app.globalData.algorithm);
        if (data.list) {
          if (that.localData.start < data.pages) {
            that.localData.start += 1;
            that.localData.hasMoreData = true;           
          } else {
            that.localData.hasMoreData = false;  
          }

          that.localData.questionList = that.localData.questionList.concat(data.list);

          that.setData({
            list: that.localData.questionList
          });
        }
      });
  },

	/**
	 * 填写评分值
	 */
	bindKeyInput : function(e) {
    var result = this.localData.result;

    // id结构为"题目索引"
    var selectedItem = this.localData.questionList[e.target.id];
    var score = selectedItem.questionScore;
    var id = selectedItem.id;
    var item = {
      questionId: id,
      answer: e.detail.value
    };

    // 值为空表示删除
    if (item.answer == '') {
      validator.remove(result, item, function (a, b) { return a.questionId == b.questionId;});
      return;
    }

		// 判断用户输入的是否为数字
    if (!validator.isDigest(item.answer)) {return;}

		// 判断填写的分值是否符合规则
    if (!validator.scoreRange(item.answer, 0, score)) { return; }

    // 像数组新增项，若id已经存在则更新
    validator.merge(result, item, 
      function (a, b) { return a.questionId == b.questionId; }, function (a, b) { a.answer = b.answer;});
	},

	/**
	 * 提交记录
	 */
	next : function(e) {
    var that = this;
    var result = that.localData.result;
    if (result.length != this.localData.questionList.length) {
			wx.showToast({
				title : '题目未全部答完',
				icon : 'sucess',
				duration : 1500,
				mask : true
			});
			return;
		}

    wx.showModal({
      title: '提示',
      content: '确认提交积分考核？',
      success: function (res) {
        if (res.confirm) {
          that.submitAnswer();
        }
      }
    });
	}, 

  /*
   * 提交答案
   */
  submitAnswer: function() {
    var result = crypt.encrypt(this.localData.result, app.globalData.token, app.globalData.algorithm);

    network.requestLoading(
      common.business.answer.save, 
      {
        result: result,
        token: app.globalData.token
      },
      '正在提交请稍后',
      function(res) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000,
          mask: true
        });
        wx.navigateTo({
          url: '../../attachment/detail'
        });
      }
    );
  }

})