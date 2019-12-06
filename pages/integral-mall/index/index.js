var integral_catId = 0, integral_index = -1, page = 1;

Page({
    data: {
      goods_list: [],
      tab_index: 0,
      coupon_list: [],
      goods_list: [],
      gift_list: []
    },
    onLoad: function(t) {
      getApp().core.showLoading({
        title: "加载中"
      })
        getApp().page.onLoad(this, t);
        var a = this;
        getApp().request({
          url: getApp().api.integral.index,
          data: {},
          success: function (t) {
            if (0 == t.code) {
              a.setData({
                banner_list: t.data.banner_list,
                coupon_list: t.data.coupon_list,
                goods_list: t.data.goods_list,
                gift_list: t.data.gift_list || [],
                integral: t.data.user.integral,
                behav_integral: t.data.user.behav_integral,
                //catList: t.data.cat_list
              });
            }
          },
          complete: function (t) {
            getApp().core.hideLoading();
          }
        });
    },
    switchTab: function(t){
      var a = this;
      a.setData({
        tab_index: t.currentTarget.dataset.index
      });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
    },
    
    couponInfo: function(t) {
        var e = t.currentTarget.dataset;
        getApp().core.navigateTo({
            url: "/pages/integral-mall/coupon-info/index?coupon_id=" + e.id
        });
    },
    goPond: function (t) {
      getApp().core.navigateTo({
        url: "/pond/pond/pond"
      });
    },
    
    goodsInfo: function(t) {
        var e = t.currentTarget.dataset.goodsId;
        getApp().core.navigateTo({
            url: "/pages/integral-mall/goods-info/index?goods_id=" + e + "&integral=" + this.data.integral
        });
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = getApp().getUser(), e = "", a = getApp().core.getStorageSync(getApp().const.WX_BAR_TITLE);
        for (var n in a) if ("pages/integral-mall/index/index" === a[n].url) {
            e = a[n].title;
            break;
        }
        return {
            path: "/pages/integral-mall/index/index?user_id=" + t.id,
            title: e || "积分商城"
        };
    },
    onReachBottom: function(t) {},
    shuoming: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/shuoming/index"
        });
    },
    detail: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/detail/index"
        });
    },
    exchange: function() {
        getApp().core.navigateTo({
          url: "/pages/coupon/coupon"
        });
    },
    register: function() {
        getApp().core.navigateTo({
            url: "/pages/integral-mall/register/index"
        });
    }
});