
Page({
    data: {
        showModel: !1,
        isClick: false,
        lastClickTime: 0
    },
    onLoad: function(t) {
      
        if (getApp().page.onLoad(this, t), t.coupon_id) {
          getApp().core.showLoading({
            title: "加载中..."
          });
            var e = t.coupon_id, n = this;
            getApp().request({
                url: getApp().api.integral.coupon_info,
                data: {
                    coupon_id: e
                },
                success: function(t) {
                    0 == t.code && n.setData({
                        coupon: t.data.coupon,
                        info: t.data.info,
                        user: t.data.user
                    });
                    
                },
                complete: function () {
                  getApp().core.hideLoading();
                }
            });
        }
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
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
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
    },
    exchangeCoupon: function(t) {
        let self = this;
        let currentTime = t.timeStamp;
        if (currentTime - this.data.lastClickTime < 1000){
           return;
        }
        if(self.data.isClick){
           return;
        }
        self.setData({isClick:true});
        var n = this, o = n.data.coupon, a = 0;
        if (o.point_type == '消费积分'){
           a = n.data.user.integral;
        }else{
           a = n.data.user.behav_integral;
        }
        if (parseInt(o.integral) > parseInt(a)) n.setData({
            showModel: !0,
            content: "当前积分不足",
            status: 1,
            isClick: false,
            lastClickTime: currentTime
        }); else {
            if (0 < parseFloat(o.price)) var e = "需要" + o.integral + "积分+￥" + parseFloat(o.price); else e = "需要" + o.integral + "积分";
            if (parseInt(o.total_num) <= 0) return void n.setData({
                showModel: !0,
                content: "已领完,来晚一步",
                status: 1,
                isClick: false,
                lastClickTime: currentTime
            });
            if (parseInt(o.num) >= parseInt(o.user_num)) return o.type = 1, void n.setData({
                showModel: !0,
                content: "兑换次数已达上限",
                status: 1,
                isClick: false,
                lastClickTime: currentTime
            });
            getApp().core.showModal({
                title: "确认兑换",
                content: e,
                success: function(t) {
                    t.confirm && (0 < parseFloat(o.price) ? (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().api.integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 2
                        },
                        success: function(e) {
                            0 == e.code ? getApp().core.requestPayment({
                                _res: e,
                                timeStamp: e.data.timeStamp,
                                nonceStr: e.data.nonceStr,
                                package: e.data.package,
                                signType: e.data.signType,
                                paySign: e.data.paySign,
                                complete: function(t) {
                                    "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" == t.errMsg && (o.num = parseInt(o.num), 
                                    o.num += 1, o.total_num = parseInt(o.total_num), o.total_num -= 1, a = parseInt(a), 
                                    a -= parseInt(o.integral), n.setData({
                                        showModel: !0,
                                        status: 4,
                                        content: e.msg,
                                        coupon: o
                                    })) : getApp().core.showModal({
                                        title: "提示",
                                        content: "订单尚未支付",
                                        showCancel: !1,
                                        confirmText: "确认"
                                    });
                                }
                            }) : n.setData({
                                showModel: !0,
                                content: e.msg,
                                status: 1
                            });
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                            n.setData({
                              isClick: false,
                              lastClickTime: currentTime
                            });
                        }
                    })) : (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().api.integral.exchange_coupon,
                        data: {
                            id: o.id,
                            type: 1
                        },
                        success: function(t) {
                            0 == t.code ? (o.num = parseInt(o.num), o.num += 1, o.total_num = parseInt(o.total_num), 
                            o.total_num -= 1, a = parseInt(a), a -= parseInt(o.integral), n.setData({
                                showModel: !0,
                                status: 4,
                                content: t.msg,
                                coupon: o
                            })) : n.setData({
                                showModel: !0,
                                content: t.msg,
                                status: 1
                            });
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                            n.setData({
                              isClick: false,
                              lastClickTime: currentTime
                            });
                        }
                    })));
              },complete: function () {
                n.setData({
                  isClick: false,
                  lastClickTime: currentTime
                });
              }
            });
        }
    },
    hideModal: function() {
        this.setData({
            showModel: !1
        });
    }
});