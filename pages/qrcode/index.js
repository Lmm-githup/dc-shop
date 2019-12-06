var app = getApp(), api = getApp().api;
const QR = require('../../utils/wxqrcode.js');

Page({
  data: {
    qrcode_pic: ""
  },
  onLoad: function (o) {
    getApp().page.onLoad(this, o);
    var e = this;
    getApp().request({
      url: getApp().api.ext.qrcode,
      success: function (o) {
        0 == o.code ? e.setData({
          qrcode_pic: QR.createQrCodeImg(o.data.qrcode_pic,{size:200})
        }) : getApp().core.showModal({
          title: "提示",
          content: o.msg,
          success: function () { }
        });
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