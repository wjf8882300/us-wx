// pages/question/leader/list.js
const app = getApp();
var common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    studentList:[],
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryQuestion(this);
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  queryQuestion: function(that) {
    wx.request({
      url: common.business.question.list,
      method: 'POST',
      data: {
        questionGroup: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'fail',
            duration: 1000,
            mask: true
          });

          return;
        }

        if (res.data.data && res.data.data.questionList) {
           that.leaderData.questionList = res.data.data.questionList;
        }
        
        // 查询学生
        that.queryStudent(that);     

      },
      fail: function (e) {
        wx.showToast({
          title: e,
          icon: 'fail',
          duration: 1000,
          mask: true
        });
      }
    });
  },

  queryStudent: function (that) {
    wx.request({
      url: common.business.user.queryByTeamLeaderNo,
      method: 'POST',
      data: {
        token: app.globalData.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'fail',
            duration: 1000,
            mask: true
          });

          return;
        }

        if (res.data.data) {
          that.leaderData.studentList = res.data.data;

          for (var i = 0; i < that.leaderData.questionList.length; i ++) {
            that.leaderData.questionList[i].studentList = that.leaderData.studentList;
          }

          console.log(that.leaderData.studentList);

          that.setData({
            // questionList: that.leaderData.questionList,
            studentList: that.leaderData.studentList
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: e,
          icon: 'fail',
          duration: 1000,
          mask: true
        });
      }
    });
  }, 

  leaderData: {
    questionList: [],
    studentList:[]
  },

 /**
 * 填写评分值
 */
  bindKeyInput: function (e) {
    var value = e.detail.value;

    // 判断用户输入的是否为数字
    var regNum = new RegExp('[0-9]', 'g');
    var rsNum = regNum.exec(value);
    if (!rsNum) {
      wx.showToast({
        title: '必须输入数字',
        icon: 'fail',
        duration: 1000,
        mask: true
      });
      return;
    }

    // id结构为"题目索引#学生ID"
    var index = e.target.id;
    var ids = index.split('#');
    var questionPos = ids[0];
    var studentId = ids[1];
    var selectedItem = this.data.questionList[questionPos];
    var score = selectedItem.questionScore;
    var id = selectedItem.id;

    console.log(selectedItem);

    // 判断填写的分值是否符合规则
    if (value < 0) {
      wx.showToast({
        title: '分值不能小于0',
        icon: 'fail',
        duration: 1000,
        mask: true
      });
      return;
    } else if (value > score) {
      wx.showToast({
        title: '分值不能大于' + score,
        icon: 'fail',
        duration: 1000,
        mask: true
      });
      return;
    }

    var isFound = false;
    for (var j = 0; j < this.data.result.length; j++) {
      var item = this.data.result[j];
      if (item.questionId == id && item.destUserId == studentId ) {
        this.data.result[j].answer = value;
        isFound = true;
        break;
      }
    }

    if (!isFound) {
      var item = {
        questionPos: questionPos,
        questionId: id,
        destUserId: studentId,
        answer: value
      };

      this.data.result.push(item);
    }
  },

	/**
	 * 提交记录
	 */
  next: function (e) {
    if (this.data.result.length != this.data.questionList.length) {
      wx.showToast({
        title: '题目未全部答完，不允许提交',
        icon: 'fail',
        duration: 1000,
        mask: true
      });
      return;
    } else {
      var count = {
        questionPos: '',
        questionId: '',
        size: 0
      };
      var list = [];
      for (var i = 0; i < this.data.result.length; i++) {
        var isFound = false;
        for(var j = 0; j < list.length; j ++) {
          if (list[j].questionId == this.data.result[i].questionId) {
            list[j].size += 1;
            isFound = true;
          }
        }
        if (!isFound) {
          list.push({ questionPos: this.data.result[i].questionPos, questionId: this.data.result[i].questionId, size:1});
        }
      }

      for(var i = 0; i < list.length; i ++) {
        if (list[i].size != this.leaderData.studentList.length) {
          wx.showToast({
            title: '第' + list[i].questionPos + '道题未填完',
            icon: 'fail',
            duration: 1000,
            mask: true
          });  
          return;
        }
      }
    }

    wx.request({
      url: common.business.answer.save,
      method: 'POST',
      data: {
        resultList: this.data.result,
        token: app.globalData.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'fail',
            duration: 1000,
            mask: true
          });

          return;
        }

        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000,
          mask: true
        });

      },
      fail: function (e) {
        wx.showToast({
          title: e,
          icon: 'fail',
          duration: 1000,
          mask: true
        });
      }
    });
  }
})