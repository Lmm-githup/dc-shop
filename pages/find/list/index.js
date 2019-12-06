var app = getApp(), api = getApp().api, longitude = "", latitude = "";

Page({
  data: {
    goods_list: [],
    is_search: false,
    phone: '010-5697622',
    keyword: '',
    productCode: '',
    longitude: '',
    latitude: ''
  },
  onLoad: function(e) {
    console.log(e);
    getApp().page.onLoad(this, e);
    var t = this;
    t.setData({
      keyword:e.keyword,
      productCode: e.productCode
    });
    getApp().core.showLoading({
      title: "正在加载"
    });
    getApp().request({
      url: getApp().api.ext.search_goods,
      data: {
        keyword: e.keyword,
        productCode: e.productCode
      },
      success: function (e) {
        0 == e.code && t.setData({
          goods_list: e.data,
          is_search: true
        });
      },
      complete: function () {
        getApp().core.hideLoading();
      }
    });
  },
  callPhone: function(){
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone
    })
  },
  dingwei: function () {
    var e = this;
    getApp().getauth({
      content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
      author: "scope.userLocation",
      success: function (t) {
        t && (t.authSetting["scope.userLocation"] ? getApp().core.getLocation({
          success: function (t) {
              longitude = t.longitude, latitude = t.latitude, e.goStore();
          }
        }) : getApp().core.showToast({
          title: "您取消了授权",
          image: "/images/icon-warning.png"
        }));
      }
    });
  },
  findProduct: function(){
    getApp().core.navigateTo({
      url: "/pages/find/submit-fund/index"
    });
  },
  goStore: function(e){
    getApp().core.navigateTo({
      url: "/pages/find/store/index?erp_code=" + e.currentTarget.dataset.bean.code
    });
  },
  goodsDetail: function (e) {
    getApp().core.navigateTo({
      url: "/pages/find/intro/index?id=" + e.currentTarget.dataset.bean.id
    });
  },
  goBuy: function (e) {
    getApp().core.redirectTo({
      url: "/pages/goods/goods?id="+e.currentTarget.dataset.bean.good_id
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