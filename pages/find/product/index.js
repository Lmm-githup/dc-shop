var app = getApp(), api = getApp().api;

Page({
  data: {
    history_list: [],
    keyword:''
  },
  onLoad: function (o) {
    getApp().page.onLoad(this, o);
    
  },
  searchGoods: function(e){
    if (!e.detail.value.keyword) return getApp().core.showToast({
      title: "请输入药品名称",
      image: "/images/icon-warning.png"
    }), !0;
    getApp().core.navigateTo({
      url: "/pages/find/list/index?keyword=" + e.detail.value.keyword+"&productCode="
    });
  },
  historyClick: function(e){
    getApp().core.navigateTo({
      url: "/pages/find/list/index?keyword=" + e.currentTarget.dataset.bean.keyword + "&productCode="
    });
  },
  handleScan: function () {
    wx.scanCode({
      success: (res) => {
        console.log("扫码结果");
        console.log(res);
        if(res.result){
          getApp().core.navigateTo({
            url: "/pages/find/list/index?productCode="+res.result+"&keyword="
          });
        }else{
          getApp().core.showModal({
            title: "提示",
            content: "无法识别",
            success: function () { }
          });
        }
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  goLookFund: function() {
    getApp().core.navigateTo({
      url: "/pages/find/fund/index"
    });
  },
  onReady: function () {
    getApp().page.onReady(this);
  },
  onShow: function () {
    getApp().page.onShow(this);
    var e = this;
    getApp().request({
      url: getApp().api.ext.search_hot,
      success: function (o) {
        0 == o.code ? e.setData({
          history_list: o.data
        }) : getApp().core.showModal({
          title: "提示",
          content: o.msg,
          success: function () { }
        });
      }
    });
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