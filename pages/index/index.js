var interval = 0,
  page_first_init = !0,
  timer = 1,
  fullScreen = !1;

Page({
  data: {
    x: getApp().core.getSystemInfoSync().windowWidth,//获取屏幕的宽度
    y: getApp().core.getSystemInfoSync().windowHeight,//获取屏幕的高度
    left: 0,
    show_notice: !1,//一个公告（notice）
    animationData: {},
    play: -1,
    time: 0,
    buy: !1,
    opendate: !1,
    longitude: null,//经度
    latitude: null,//维度
    shop: {
      name: ''
    },
    isFocus: false,
    isIpx: false,//如果是苹果X就是true
    userLoginName: '',
    userLoginPwd: '',
    is_delete: 0,
    account_login: 1,
    phone:false//快捷导航电话默认隐藏
  },
  onLoad: function(t) {
    getApp().page.onLoad(this, t);//app.js的args.page.onload
    var that = this;
    wx.getSystemInfo({//获取设备信息
      success: function (res) {
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";//设备型号
        if (model == 'iPhone X') {//如果设备是苹果x
          that.setData({
            isIpx: true//设置isipx为true
          })
        }
      }
    });
    if (this.data.latitude) {//如果data里面有维度 
      this.loadData(t);//获取页面的整体信息
    } else {//如果没有维度
      var userInfo = getApp().getUser();//获取用户的信息
      if (userInfo.binding){//如果存在用户的手机号
        this.dingwei(t);//获取定位信息
      }
    }
  },
  dingwei: function (param) {
    let e = this;
    getApp().core.getLocation({//wx.getLocation
      success: function (t) {//定位信息
        e.setData({
          longitude: t.longitude,
          latitude: t.latitude
        });
      },
      complete: function () {
        e.getNearby();//获取附近门店
      }
    });
  },
  
  //获取附近门店
  getNearby: function() {
    var e = this;
    getApp().request({
      url: getApp().api.ext.get_store,
      method: "GET",
      data: {
        longitude: e.data.longitude,
        latitude: e.data.latitude
      },
      success: function(t) {//头部地址【切换】
        0 == t.code && e.setData({
          shop: t.data
        });
      },
      complete: function() {
        e.loadData();
      }
    });
  },
  suspension: function() {
    var s = this;
    interval = setInterval(function() {
      getApp().request({
        url: getApp().api.default.buy_data,
        data: {
          time: s.data.time
        },
        method: "POST",
        success: function(t) {
          if (0 == t.code) {
            var a = !1;
            s.data.msgHistory == t.md5 && (a = !0);
            var e = "",
              o = t.cha_time,
              i = Math.floor(o / 60 - 60 * Math.floor(o / 3600));
            e = 0 == i ? o % 60 + "秒" : i + "分" + o % 60 + "秒", !a && t.cha_time <= 300 ? s.setData({
              buy: {
                time: e,
                type: t.data.type,
                url: t.data.url,
                user: 5 <= t.data.user.length ? t.data.user.slice(0, 4) + "..." : t.data.user,
                avatar_url: t.data.avatar_url,
                address: 8 <= t.data.address.length ? t.data.address.slice(0, 7) + "..." : t.data.address,
                content: t.data.content
              },
              msgHistory: t.md5
            }) : s.setData({
              buy: !1
            });
          }
        },
        noHandlerFail: !0
      });
    }, 1e4);
  },
  loadData: function(t) {
    var a = this,
      e = getApp().core.getStorageSync(getApp().const.PAGE_INDEX_INDEX);//获取
      e && (e.act_modal_list = [], a.setData(e)), getApp().request({
      url: getApp().api.default.index,
      success: function(t) {//首页的各个位置的信息
        // 如果page_first_init是true的话false:执行后续
        0 == t.code && (page_first_init ? a.data.user_info_show || (page_first_init = !1) : t.data.act_modal_list = [],
          a.setData(t.data), getApp().core.setStorageSync(getApp().const.PAGE_INDEX_INDEX, t.data),
          a.miaoshaTimer());
          a.setData({ isFocus: t.data.isFocus});
          // if(t.data.is_delete == 1){//如果t.data.is_delete == 1为1的话登录页面就显示
          //   a.setData({ user_info_show: true });
          // }
      },
      complete: function() {
        getApp().core.stopPullDownRefresh();
      }
    });
  },
  onShow: function() {
    var e = this;
    getApp().page.onShow(this), getApp().getConfig(function(t) {
      var a = t.store;
      // console.log(a.name)首页标题的名字
      a && a.name && getApp().core.setNavigationBarTitle({//首页商城title
        title: a.name
      }), a && 1 === a.purchase_frame ? e.suspension(e.data.time) : e.setData({
        buy_user: ""
      });
    }), e.notice();
  },
  onPullDownRefresh: function() {
    getApp().getStoreData(), clearInterval(timer), this.loadData();
  },
  onShareAppMessage: function(t) {
    getApp().page.onShareAppMessage(this);
    return {
      path: "/pages/index/index?user_id=" + getApp().getUser().id,
      title: this.data.store.name
    };
  },
  showshop: function(t) {
    var a = this,
      e = t.currentTarget.dataset.id,
      o = t.currentTarget.dataset;
    getApp().request({
      url: getApp().api.default.goods,
      data: {
        id: e
      },
      success: function(t) {
        0 == t.code && a.setData({
          data: o,
          attr_group_list: t.data.attr_group_list,
          goods: t.data,
          showModal: !0
        });
      }
    });
  },
  receive: function(t) {
    var e = this,
      a = t.currentTarget.dataset.index;
    getApp().core.showLoading({
      title: "领取中",
      mask: !0
    }), e.hideGetCoupon || (e.hideGetCoupon = function(t) {
      var a = t.currentTarget.dataset.url || !1;
      e.setData({
        get_coupon_list: null
      }), wx.navigateTo({
        url: a || "/pages/list/list"
      });
    }), getApp().request({
      url: getApp().api.coupon.receive,
      data: {
        id: a
      },
      success: function(t) {
        getApp().core.hideLoading(), 0 == t.code ? e.setData({
          get_coupon_list: t.data.list,
          coupon_list: t.data.coupon_list
        }) : (getApp().core.showToast({
          title: t.msg,
          duration: 2e3
        }), e.setData({
          coupon_list: t.data.coupon_list
        }));
      }
    });
  },
  closeCouponBox: function(t) {
    this.setData({
      get_coupon_list: ""
    });
  },
  notice: function() {
    var t = this.data.notice;
    if (void 0 !== t) t.length;
  },
  miaoshaTimer: function() {
    var t = this;
    t.data.miaosha && 0 != t.data.miaosha.rest_time && (t.data.miaosha.ms_next || (timer = setInterval(function() {
      0 < t.data.miaosha.rest_time ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1,
        t.data.miaosha.times = t.setTimeList(t.data.miaosha.rest_time), t.setData({
          miaosha: t.data.miaosha
        })) : clearInterval(timer);
    }, 1e3)));
  },
  onHide: function() {
    getApp().page.onHide(this), this.setData({
      play: -1
    }), clearInterval(interval);
  },
  onUnload: function() {
    getApp().page.onUnload(this), this.setData({
      play: -1
    }), clearInterval(timer), clearInterval(interval);
  },
  showNotice: function() {
    this.setData({
      show_notice: !0
    });
  },
  handleScan: function() {
    wx.scanCode({
      success: (res) => {
        if (res.result) {
          getApp().core.navigateTo({
            url: "/pages/find/list/index?productCode=" + res.result + "&keyword="
          });
        } else {
          getApp().core.showModal({
            title: "提示",
            content: "无法识别",
            success: function() {}
          });
        }
      },
      fail: (res) => {
        
      }
    })
  },
  closeNotice: function() {
    this.setData({
      show_notice: !1
    });
  },
  to_dial: function() {
    var t = this.data.store.contact_tel;
    getApp().core.makePhoneCall({
      phoneNumber: t
    });
  },
  closeActModal: function() {
    var t, a = this,
      e = a.data.act_modal_list,
      o = !0;
    for (var i in e) {
      var s = parseInt(i);
      e[s].show && (e[s].show = !1, void 0 !== e[t = s + 1] && o && (o = !1, setTimeout(function() {
        a.data.act_modal_list[t].show = !0, a.setData({
          act_modal_list: a.data.act_modal_list
        });
      }, 500)));
    }
    a.setData({
      act_modal_list: e
    });
  },
  naveClick: function(t) {
    getApp().navigatorClick(t, this);
  },
  play: function(t) {
    this.setData({
      play: t.currentTarget.dataset.index
    });
  },
  onPageScroll: function(t) {
    var a = this;
    if (!fullScreen && -1 != a.data.play) {
      var e = getApp().core.getSystemInfoSync().windowHeight;
      "undefined" == typeof my ? getApp().core.createSelectorQuery().select(".video").fields({
        rect: !0
      }, function(t) {
        (t.top <= -200 || t.top >= e - 57) && a.setData({
          play: -1
        });
      }).exec() : getApp().core.createSelectorQuery().select(".video").boundingClientRect().scrollOffset().exec(function(t) {
        (t[0].top <= -200 || t[0].top >= e - 57) && a.setData({
          play: -1
        });
      });
    }
  },
  fullscreenchange: function(t) {
    fullScreen = !!t.detail.fullScreen;
  },
  switchShop: function() {
    getApp().core.navigateTo({
      url: "/pages/shoplist/shop"
    });
  },
  goWechat: function() {
    getApp().core.navigateTo({
      url: "/pages/web/authorization/authorization"
    });
  },
  setLogin: function () {
    this.setData({
      user_login_show: true
    });
  },
  setPhoneAuth: function () {
    this.setData({
      user_login_show: false
    });
  },
  bindKeyLoginAccount: function(e){
    this.setData({
      userLoginName: e.detail.value
    })
  },
  bindKeyLoginPwd: function (e) {
    this.setData({
      userLoginPwd: e.detail.value
    })
  },
  bindUserLogin: function() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
      duration: 20000
    })
    var that = this;
    getApp().request({
      url: getApp().api.ext.mock_login,
      method: "POST",
      data: {
        userName: that.data.userLoginName,
        userPwd: that.data.userLoginPwd,
      },
      success: function (e) {
        wx.hideToast();
        if (0 == e.code) {
          var t = getApp().getUser();
          var __user_info = that.data.__user_info;
          __user_info.PhoneNumber = e.data.dataObj;
          __user_info.binding = e.data.dataObj;
          getApp().setUser(__user_info);
          that.dingwei();
          that.loadRoute();
        } else getApp().core.showToast({
          title: "登陆失败！"
        });
      },
      complete: function (e) {
        getApp().core.hideLoading();
      }
    });
  },
  loadRoute: function () {
    getApp().core.redirectTo({
      url: "/pages/index/index"
    })
    this.setUserInfoShowFalse();
  },
  setUserInfoShowFalse: function () {
    this.setData({
      user_info_show: !1
    });
  },
  // 点击首页定位会员码按钮图标
  dingweiQucode:function(){
    getApp().core.navigateTo({
      url: "/pages/qrcode/index"
    });
  },
  // 点击快捷导航
  phoneOpen:function(){
    this.setData({phone:!this.data.phone})
  },
  // 点击打电话
  phoneBtn: function () {
    getApp().core.makePhoneCall({
      phoneNumber: "18712312312"
    });
  },
});
