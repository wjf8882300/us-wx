// pages/login/login.js

const app = getApp();
var common = require('../../utils/common.js');
var md5Util = require('../../utils/md5.js');
var desUtil = require('../../utils/3des.js');
var validator = require('../../utils/validator.js');
var base64 = require('../../utils/base64.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: ''
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
    this.localData.password = e.detail.value;
    this.checkPassword(this.localData.password);
  },

  checkPassword: function(value) {
    if (value == '') {
      this.setData({ message: '密码不能为空' });
      return false;
    }
    else if (!validator.checkPassword(value)) {
      this.setData({ message: '密码格式不正確，必须为字母或者数字' });
      return false;
    } else {
      this.setData({ message: '' });
      return true;
    }
  },

  /**
   * 跳转到下一页
   */
  next: function(e) {
    var value = this.localData.password;
    var userType = this.localData.userType;

    if (!this.checkPassword(value)) {return;}

    if (!app.globalData.token) {
      wx.showToast({
        title: '网络链接错误',
        icon: 'success',
        duration: 1000,
        mask: true
      });
      return;
    }

    value = md5Util.encrypt(value);
    value = desUtil.encrypt(value, app.globalData.token);

    wx.request({
      url: common.business.user.login,
      method: 'POST',
      data: {
        userType: userType,
        password: value,
        token: app.globalData.token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code != 200) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 1000,
            mask: true
          });

          return;
        }

        // wx.navigateTo({
        //   url: '../attachment/detail'
        // });
        // return;

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
  },

  radioChange: function (e) {
    this.localData.userType = e.detail.value;
  },

  localData: {
    userType: '0',
    password: ''
  }
})