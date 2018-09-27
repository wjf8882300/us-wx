// pages/attachment/detail.js
const app = getApp();
var common = require('../../utils/common.js');
var validator = require('../../utils/validator.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    index: 0
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

  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++){
          var item = {
            attachementPath: tempFilePaths[i],
            imgOpacity: 1
          };
          that.data.list.push(item);
        }
        
        that.setData({
          list: that.data.list
        });
      }
    });
  },

  preview:function(e) {
    var imgData = this.data.list[parseInt(e.target.id)];
    if (imgData.endTime - imgData.startTime < 350) {
      var imgList = e.currentTarget.dataset.list;//获取data-list;
      wx.previewImage({
        urls: [imgList] // 需要预览的图片http链接列表
      });
    }
  },

  deleteImgage: function(e) {
    var that = this;
    wx.showModal({
      title: '删除',
      content: '确认删除图片？',
      success: function (res) {
        if (res.confirm) {
          var item = {
            attachementPath: e.currentTarget.dataset.src,
            imgOpacity: 1
          };
          validator.remove(that.data.list, item, function (a, b) { return a.attachementPath == b.attachementPath; });
          that.setData({
            list: that.data.list
          });
        }
      }
    });
  },

  touchStart: function(e) {
    this.data.list[parseInt(e.target.id)].startTime = e.timeStamp;
  },

  touchEnd: function(e) {
    this.data.list[parseInt(e.target.id)].endTime = e.timeStamp;
  },

  next: function(e) {
    var that = this;
    if (that.data.list.length == 0) {
      wx.showModal({
        title: '上传',
        content: '您确定不上传证明文件？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../result/result'
            });
          }
        }
      });
    } else if (that.data.list.length > 5) {
      wx.showToast({
        title: '文件不能超5个',
        icon: 'success',
        duration: 1500,
        mask: true
      });
      return;
    } else {
      var that = this;

      // 先设置透明度为50%
      for (var i = 0; i < that.data.list.length; i++) {
        that.data.list[i].imgOpacity = 0.5;
      }
      this.setData({ list: that.data.list});
      that.uploadImage(that.data.index);
    }
    },

  uploadImage: function (i) {
    wx.showToast({
      title: '正在上传第' + (i+1) + '张',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
    var that = this;
    wx.uploadFile({
      url: common.business.attachement.uploadImage,
      filePath: that.data.list[i].attachementPath,
      name: 'file',
      formData: {
        'token': app.globalData.token
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        if (data.code == 200) {
          wx.hideToast();
          that.data.list[i].imgOpacity = 1;  
          that.setData({ list: that.data.list });
          if (++i >= that.data.list.length) {
            wx.hideToast();
            wx.showToast({
              title: '上传完成',
              icon: 'sucess',
              duration: 1500,
              mask: true
            });
            wx.navigateTo({
              url: '../result/result'
            });
            return;
          }
          else {
            that.uploadImage(i);
        }
      } else {
          wx.showToast({
            title: data.message,
            icon: 'sucess',
            duration: 2500,
            mask: true
          });
      }
    }
    });
  }
})