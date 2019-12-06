var app = getApp(), api = getApp().api;

Page({
  data: {
    location: '',
    shop_list:[],
    erp_code: null,
    no_data: false,
    page: 1,
    page_count: 1,
  },
  onLoad: function (e) {
    getApp().page.onLoad(this, e);
    var t = this;
    t.setData({
      erp_code: e.erp_code
    });
    getApp().core.showLoading({
      title: "正在加载"
    });
    getApp().request({
      url: getApp().api.ext.goods_store,
      data: {
        erp_code: e.erp_code
      },
      success: function (o) {
        if (0 == o.code){
          t.setData({
            shop_list: o.data.list,
            page_count: o.data.page_count,
            row_count: o.data.row_count,
          });
          if(o.data.list.length == 0){
            t.setData({no_data: true});
          }
        }else{
          t.setData({ no_data: true });
        }
        getApp().core.hideLoading();
      }
    });
  },
  callPhone: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.bean.mobile
    })
  },
  goShopDetail: function(e) {
    getApp().core.navigateTo({
      url: "/pages/shop-detail/shop-detail?shop_id=" + e.currentTarget.dataset.bean.id
    });
  },
  goto: function (d) {
    var latitude = d.currentTarget.dataset.bean.latitude;
    var longitude = d.currentTarget.dataset.bean.longitude;
    var name = d.currentTarget.dataset.bean.name;
    var address = d.currentTarget.dataset.bean.address;
    var t = this;
    "undefined" != typeof my ? t.location() : getApp().core.getSetting({
      success: function (e) {
        e.authSetting["scope.userLocation"] ? t.location() : getApp().getauth({
          content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
          cancel: !1,
          author: "scope.userLocation",
          success: function (e) {
            e.authSetting["scope.userLocation"] && t.location(latitude, longitude, name, address);
          }
        });
      }
    });
  },
  location: function (latitude, longitude,name,address) {
    getApp().core.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: name,
      address: address
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
  onReachBottom: function () { 
    var t = this;
    if(t.data.page < t.data.page_count){
      t.loadMoreData();
    }
  },
  loadMoreData: function(){
    var a = this, o = a.data.page || 2;
    getApp().core.showLoading({
      title: "加载中"
    }), getApp().request({
      url: getApp().api.ext.goods_store,
      method: "GET",
      data: {
        page: o,
        erp_code: a.data.erp_code
      },
      success: function (t) {
        if (0 == t.code) {
          a.setData({
            shop_list: a.data.shop_list.concat(t.data.list),
            page_count: t.data.page_count,
            row_count: t.data.row_count,
            page: o + 1
          });
        }
      },
      complete: function () {
        getApp().core.hideLoading();
      }
    });
  }
});