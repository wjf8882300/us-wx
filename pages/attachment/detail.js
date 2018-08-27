// pages/attachment/detail.js
const app = getApp();
var common = require('../../utils/common.js');

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

  uploadImage: function(e) {

    var that = this;

    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: common.business.attachement.uploadImage, 
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'token': app.globalData.token
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            if(data.code == 200) {
                var item = {
                  attachementPath: common.server.staticUrl + "/" + data.data.attachementPath
                };
                that.data.list.push(item);
                that.setData({
                  list: that.data.list
                });
            }
          }
        })
      }
    })
  }
})