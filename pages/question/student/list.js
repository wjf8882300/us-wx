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
		this.queryQuestion('努力加载中');
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
    this.queryQuestion('努力加载中');
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
        var data = crypt.decrypt(res, app.globalData.token);
        console.log(data);
        if (data.list) {
          if (that.localData.start < data.pages) {
            that.localData.start += 1;
            that.localData.hasMoreData = true;           
          } else {
            that.localData.hasMoreData = false;  
          }

          that.localData.questionList = that.localData.questionList.concat(data.list);

          console.log(that.localData.questionList);
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
		var value = e.detail.value;
    var result = this.localData.result;

    // id结构为"题目索引"
    var index = e.target.id;
    var selectedItem = this.localData.questionList[index];
    var score = selectedItem.questionScore;
    var id = selectedItem.id;

    // 值为空表示删除
    if (value == '') {
      for (var i = 0; i < result.length; i++) {
        if (result[i].questionId == id) {
          result.splice(i, 1);
          break;
        }
      }
      return;
    }

		// 判断用户输入的是否为数字
		var regNum = new RegExp('[0-9]', 'g');
		var rsNum = regNum.exec(value);
		if(!rsNum) {
			wx.showToast({
				title : '必须输入数字',
				icon : 'fail',
				duration : 1500,
				mask : true
			});
			return;
		}

		// 判断填写的分值是否符合规则
		if(value < 0) {
			wx.showToast({
				title : '分值不能小于0',
				icon : 'fail',
				duration : 1500,
				mask : true
			});
			return;
    } else if (value > score) {
      wx.showToast({
        title: '分值不能大于' + score,
        icon: 'fail',
        duration: 1500,
        mask: true
      });
      return;
    }

		var isFound = false;
		for (var j = 0; j < result.length; j++) {
			var item = result[j];
			if (item.questionId == id) {
				result[j].answer = value;
				isFound = true;
				break;
			}
		}

		if (!isFound) {
			var item = {
				questionId : id,
				answer : value
			};

			result.push(item);
		}
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

    var result = crypt.encrypt(this.localData.result, app.globalData.token);

    wx.showToast({
      title: '正在提交请稍后',
      icon: 'loading',
      duration: 10000
    });

    wx.request({
      url: common.business.answer.save,
      method: 'POST',
      data: {
        result: result,
        token: app.globalData.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideToast();
        if (res.data.code != 200) {
          if (res.data.code = common.errorcode.NOT_LOGIN) {
            wx.showToast({
              title: res.data.message,
              icon: 'fail',
              duration: 2500,
              mask: true
            });
            wx.navigateTo({
              url: '../../login/login'
            });
            return;
          }

          wx.showToast({
            title: res.data.message,
            icon: 'fail',
            duration: 1500,
            mask: true
          });
          return;
        }

        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500,
          mask: true
        });

        wx.navigateTo({
          url: '../../attachment/detail'
        });

      },
      fail: function (e) {
        wx.hideToast();
        wx.showToast({
          title: e,
          icon: 'fail',
          duration: 1500,
          mask: true
        });
      }
    });
  }

})