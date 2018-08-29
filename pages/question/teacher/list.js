// pages/question/teacher/list.js
const app = getApp();
var common = require('../../../utils/common.js');
var crypt = require('../../../utils/crypt.js');
var validator = require('../../../utils/validator.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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

  queryQuestion: function (that) {

    wx.showToast({
      title: '努力加载中...',
      icon: 'loading',
      duration: 10000,
      mask: true
    });

    wx.request({
      url: common.business.question.list,
      method: 'POST',
      data: {
        token: app.globalData.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code != 200) {
          wx.hideToast();
          wx.showToast({
            title: res.data.message,
            icon: 'fail',
            duration: 1000,
            mask: true
          });

          return;
        }

        if (res.data.data) {
          var data = crypt.decrypt(res.data.data, app.globalData.token);
          if (data) {
            that.localData.questionList = data;
          }
        }

        // 查询学生
        that.queryStudent(that);

      },
      fail: function (e) {
        wx.hideToast();
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
      url: common.business.user.query,
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

          var data = crypt.decrypt(res.data.data, app.globalData.token);
          if (data) {
            that.localData.studentList = data;
          }

          that.setData({
            questionList: that.localData.questionList,
            studentList: that.localData.studentList
          });
        }

        wx.hideToast();
      },
      fail: function (e) {
        wx.hideToast();
        wx.showToast({
          title: e,
          icon: 'fail',
          duration: 1000,
          mask: true
        });
      }
    });
  },

  localData: {
    questionList: [],
    studentList: [],
    result: []
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

    if (value == '') {
      for (var i = 0; i < result.length; i++) {
        if (result[i].questionId == id
          && result[i].destUserId == studentId) {
          result.splice(i, 1);
          break;
        }
      }
      return;
    }

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

    // 检查是否是修改已经提交的值，是则修改（通过questionId和destUserId判断）
    var isFound = false;
    for (var j = 0; j < result.length; j++) {
      var item = result[j];
      if (item.questionId == id && item.destUserId == studentId) {
        result[j].answer = value;
        isFound = true;
        break;
      }
    }

    // 新加数据放入数组
    if (!isFound) {
      var item = {
        questionPos: questionPos,
        questionId: id,
        destUserId: studentId,
        answer: value
      };

      result.push(item);
    }
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
            var isFound = false;
            for (var j = 0; j < list.length; j++) {
              if (list[j].questionId == result[i].questionId) {
                list[j].size += 1;
                isFound = true;
              }
            }
            if (!isFound) {
              list.push({ questionPos: result[i].questionPos, questionId: result[i].questionId, size: 1 });
            }
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

  submitAnswer: function() {
    var result = crypt.encrypt(this.localData.result, app.globalData.token);

    wx.showToast({
      title: '正在提交请稍后',
      icon: 'loading',
      duration: 10000
    });

    wx.request({
      url: common.business.answer.saveTeam,
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

        wx.navigateTo({
          url: '../../result/result'
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