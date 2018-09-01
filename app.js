//app.js
var common = require('utils/common.js');

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: common.business.user.apply,
          method: 'POST',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.code != 200) {
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 1000,
                mask: true
              });

              return;
            }

            // 存储token
            that.globalData.token = res.data.data.token;
            that.globalData.algorithm = res.data.data.algorithm;
          },
          fail: function (e) {
            wx.showToast({
              title: '网络链接出错',
              icon: 'fail',
              duration: 1000,
              mask: true
            });
          }
        });  
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    token: '',
    algorithm: 0
  }
})