// pages/question/student/list.js
const app = getApp();
var common = require('../../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: common.business.question.list,
      method: 'POST',
      data: {
        questionGroup: '0'
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
          that.setData({
            list: res.data.data.questionList
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

  /**
   * 填写评分值
   */
  bindKeyInput: function(e) {


  },

  /**
   * 提交记录
   */
  next: function(e) {

  }


})