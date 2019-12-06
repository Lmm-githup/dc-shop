var app = getApp();

Page({
  data: {
    fund_list: null
  },
  onLoad: function(e) {
    getApp().page.onLoad(this, e);
    this.getData();
  },
  getData: function(){
    var t = this;
    getApp().core.showLoading({
      title: "正在加载"
    });
    getApp().request({
      url: getApp().api.ext.get_fund,
      data: {},
      success: function (e) {
        0 == e.code && t.setData({
          fund_list: e.data
        });
      },
      complete: function () {
        getApp().core.hideLoading();
      }
    });
  },
  findProduct: function () {
    getApp().core.redirectTo({
      url: "/pages/find/submit-fund/index"
    });
  },
  onReady: function () {
    getApp().page.onReady(this);
  },
  onShow: function () {
    getApp().page.onShow(this);
  },
  onHide: function () {
    getApp().page.onHide(this);
  },
  onUnload: function () {
    getApp().page.onUnload(this);
  },
  onPullDownRefresh: function () { },
  onReachBottom: function () { }
});