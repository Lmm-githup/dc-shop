var is_loading = !1, is_no_more = !1;
var area_picker = require("./../../components/area-picker/area-picker.js");

Page({
    data: {
        page: 1,
        page_count: 1,
        longitude: "",
        latitude: "",
        score: [ 1, 2, 3, 4, 5 ],
        keyword: "",
        district: '',
        province: '',
        city: ''
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        //t.user_id;
        //e.getDistrictData(function (t) {
        //  area_picker.init({
        //    page: e,
        //    data: t
        //  });
        //}),
      getApp().core.showLoading({
        title: "加载中"
      }),
        getApp().core.getLocation({
            success: function(t) {
                e.setData({
                    longitude: t.longitude,
                    latitude: t.latitude
                });
            },
            complete: function() {
                e.loadData();
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    callPhone: function (e) {
      let phone = e.currentTarget.dataset.bean.mobile;
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    loadData: function() {
        var e = this;
         getApp().request({
            url: getApp().api.default.shop_list,
            method: "GET",
            data: {
                longitude: e.data.longitude,
                latitude: e.data.latitude
            },
            success: function(t) {
                0 == t.code && e.setData(t.data);
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
  goto: function (e) {
    var a = this;
    "undefined" != typeof my ? a.location(e) : getApp().core.getSetting({
      success: function (t) {
        t.authSetting["scope.userLocation"] ? a.location(e) : getApp().getauth({
          content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
          cancel: !1,
          author: "scope.userLocation",
          success: function (t) {
            t.authSetting["scope.userLocation"] && a.location(e);
          }
        });
      }
    });
  },
  location: function (t) {
    var e = this.data.list, a = t.currentTarget.dataset.index;
    getApp().core.openLocation({
      latitude: parseFloat(e[a].latitude),
      longitude: parseFloat(e[a].longitude),
      name: e[a].name,
      address: e[a].address
    });
  },
    getDistrictData: function (t) {
      var a = getApp().core.getStorageSync(getApp().const.DISTRICT);
      if (!a) return getApp().core.showLoading({
        title: "正在加载",
        mask: !0
      }), void getApp().request({
        url: getApp().api.default.district,
        success: function (e) {
          getApp().core.hideLoading(), 0 == e.code && (a = e.data, getApp().core.setStorageSync(getApp().const.DISTRICT, a),
            t(a));
        }
      });
      t(a);
    },
    onAreaPickerConfirm: function (e) {
      this.setData({
          province: e[0].name,
          city: e[1].name,
          district: e[2].name
      });
      this.search();
    },
    onPullDownRefresh: function() {
        var e = this;
        e.setData({
            keyword: "",
            page: 1
        }), getApp().core.getLocation({
            success: function(t) {
                e.setData({
                    longitude: t.longitude,
                    latitude: t.latitude
                });
            },
            complete: function() {
                e.loadData(), getApp().core.stopPullDownRefresh();
            }
        });
    },
    onReachBottom: function() {
        var t = this;
        t.data.page >= t.data.page_count || t.loadMoreData();
    },
    loadMoreData: function() {
        var a = this, o = a.data.page;
        is_loading || (is_loading = !0, getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.default.shop_list,
            method: "GET",
            data: {
                page: o,
                longitude: a.data.longitude,
                latitude: a.data.latitude
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = a.data.list.concat(t.data.list);
                    a.setData({
                        list: e,
                        page_count: t.data.page_count,
                        row_count: t.data.row_count,
                        page: o + 1
                    });
                }
            },
            complete: function() {
                getApp().core.hideLoading(), is_loading = !1;
            }
        }));
    },
    goto: function(e) {
        var a = this;
        "undefined" != typeof my ? a.location(e) : getApp().core.getSetting({
            success: function(t) {
                t.authSetting["scope.userLocation"] ? a.location(e) : getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    author: "scope.userLocation",
                    success: function(t) {
                        t.authSetting["scope.userLocation"] && a.location(e);
                    }
                });
            }
        });
    },
    location: function(t) {
        var e = this.data.list, a = t.currentTarget.dataset.index;
        getApp().core.openLocation({
            latitude: parseFloat(e[a].latitude),
            longitude: parseFloat(e[a].longitude),
            name: e[a].name,
            address: e[a].address
        });
    },
  goShopDetail: function (e) {
    getApp().core.navigateTo({
      url: "/pages/shop-detail/shop-detail?shop_id=" + e.currentTarget.dataset.bean.id
    });
  },
    inputFocus: function(t) {
        this.setData({
            show: !0
        });
    },
    inputBlur: function(t) {
        this.setData({
            show: !1
        });
    },
    inputConfirm: function(t) {
        this.search();
    },
    input: function(t) {
        this.setData({
            keyword: t.detail.value
        });
    },
    search: function(t) {
        var e = this;
        getApp().core.showLoading({
            title: "搜索中"
        }), getApp().request({
            url: getApp().api.default.shop_list,
            method: "GET",
            data: {
                keyword: e.data.keyword,
                longitude: e.data.longitude,
                latitude: e.data.latitude,
                province: e.data.province,
                city: e.data.city,
                area: e.data.district                
            },
            success: function(t) {
                0 == t.code && e.setData(t.data);
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    go: function(t) {
        var e = t.currentTarget.dataset.bean;
        //getApp().core.navigateTo({
        //    url: "/pages/shop-detail/shop-detail?shop_id=" + a[e].id
        //});
      getApp().core.showLoading({
        title: "切换门店中..."
      }), getApp().request({
        url: getApp().api.ext.switch_shop,
        method: "POST",
        data: {
          id: e.id
        },
        success: function (d) {
          if(0 == d.code){
            getApp().core.reLaunch({
              url: "/pages/index/index"
            });
          }
        },
        complete: function () {
          getApp().core.hideLoading();
        }
      });
    },
    navigatorClick: function(t) {
        var e = t.currentTarget.dataset.open_type, a = t.currentTarget.dataset.url;
        return "wxapp" != e || ((a = function(t) {
            var e = /([^&=]+)=([\w\W]*?)(&|$|#)/g, a = /^[^\?]+\?([\w\W]+)$/.exec(t), o = {};
            if (a && a[1]) for (var n, i = a[1]; null != (n = e.exec(i)); ) o[n[1]] = n[2];
            return o;
        }(a)).path = a.path ? decodeURIComponent(a.path) : "", getApp().core.navigateToMiniProgram({
            appId: a.appId,
            path: a.path,
            complete: function(t) {}
        }), !1);
    },
    onShareAppMessage: function(t) {
        return getApp().page.onShareAppMessage(this), {
            path: "/pages/shop/shop?user_id=" + getApp().core.getStorageSync(getApp().const.USER_INFO).id
        };
    }
});