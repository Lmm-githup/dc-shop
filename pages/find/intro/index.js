var WxParse = require("../../../wxParse/wxParse.js");
var app = getApp(), api = getApp().api;

Page({
  data: {
    goods: null,
    pic_list: null,
  },
  onLoad: function (e) {
    getApp().page.onLoad(this, e);
    var t = this;
    getApp().request({
      url: getApp().api.ext.goods_detail,
      data: {
         id: e.id
      },
      success: function (o) {
        if(0 == o.code){
          t.setData({
            goods: o.data
          });
          var d = t.data.goods.detail ? t.data.goods.detail : "<span>暂无信息</span>";
          WxParse.wxParse("detail", "html", d, t);
        }else{
          getApp().core.showModal({
            title: "提示",
            content: o.msg,
            success: function () { }
          });
        }
      }
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