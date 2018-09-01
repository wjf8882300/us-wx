function requestLoading(url, data, message, callback) {
  wx.showToast({
    title: message,
    icon: 'loading',
    duration: 10000,
    mask: true
  });

  wx.request({
    url: url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      if (res.data.code != 200) {
        wx.showToast({
          title: res.data.message,
          icon: 'fail',
          duration: 1500,
          mask: true
        });

        return;
      }

      if (res.data.data) {
        callback(res.data.data);
      }

      wx.hideToast();
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

module.exports = {
  requestLoading: requestLoading
}