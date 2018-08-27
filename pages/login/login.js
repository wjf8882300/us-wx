// pages/login/login.js

const app = getApp();
var common = require('../../utils/common.js');

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

  passwordInput: function(e) {
    this.data.password = e.detail.value;
  },

  /**
   * 跳转到下一页
   */
  next: function(e) {
    var value = this.data.password;

    wx.request({
      url: common.business.user.login,
      method: 'POST',
      data: {
        password: value,
        code: app.globalData.code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'fail',
            duration: 1000,
            mask: true
          });

          return;
        }

        // 存储token
        app.globalData.token = res.data.data.token;

        wx.navigateTo({
          url: '../attachment/detail'
        });
        return;
        
        var userType = res.data.data.userType;
        if (userType == "0") {
          wx.navigateTo({
            url: '../question/student/list'
          });
        } else if (userType == "1") {
          wx.navigateTo({
            url: '../question/leader/list'
          });
        } else if (userType == "2") {
          wx.navigateTo({
            url: '../question/teacher/list'
          });
        }

      },
      fail: function(e) {
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