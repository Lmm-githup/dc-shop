Page({
  data: {
    loginPwd: '',
    loginName: '',
  },
  bindKeyInput: function (e) {
    this.setData({
      loginName: e.detail.value
    });
  },
  bindCode: function (e) {
    this.setData({
      loginPwd: e.detail.value
    });
  },
  userBind: function (e) {
    let t = this;
    if (!t.data.loginName || !t.data.loginPwd) {
      t.showToast({
        title: '信息不完整'
      });
      return;
    }
    wx.showToast({
      title: '处理中...',
      icon: 'loading',
      mask: true,
      duration: 20000
    })
    getApp().request({
      url: getApp().api.ext.binding_employee,
      data: {
        loginName: t.data.loginName,
        loginPwd: t.data.loginPwd
      },
      success: function (a) {
        wx.hideToast();
        if (0 == a.code) {
          t.showToast({
            title: '操作成功'
          });
          getApp().core.redirectTo({
            url: "/pages/user/user"
          });
        } else {
          t.showToast({
            title: a.msg
          });
        }
      }
    })
  },
  onLoad: function (e) {
    getApp().page.onLoad(this, e);
  },
  onReady: function (e) {
    getApp().page.onReady(this);
  },
  onShow: function (e) {
    getApp().page.onShow(this);
  },
});