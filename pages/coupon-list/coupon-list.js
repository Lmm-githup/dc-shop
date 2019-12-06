var share_count = 0;

Page({
    data: {},
    onLoad: function(t) {
        getApp().page.onLoad(this, t),this.setData({
           type: t.type || '精选'
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
        var e = this;
        getApp().core.showLoading({
            mask: !0
        }), getApp().request({
            url: getApp().api.default.coupon_list,
            data: {
              type: e.data.type
            },
            success: function(t) {
                0 == t.code && e.setData({
                    coupon_list: t.data.list
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    receive: function(t) {
        var o = this, e = t.target.dataset.index;
        getApp().core.showLoading({
            mask: !0
        }), o.hideGetCoupon || (o.hideGetCoupon = function(t) {
            var e = t.currentTarget.dataset.url || !1;
            o.setData({
                get_coupon_list: null
            }), e && getApp().core.navigateTo({
                url: e
            });
        }), getApp().request({
            url: getApp().api.coupon.receive,
            data: {
                id: e
            },
            success: function(t) {
                /*0 == t.code && o.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                });*/
                if(0 == t.code){
                  getApp().core.showModal({
                    title: "提示",
                    content: "领取成功",
                    showCancel: false
                  });
                  getApp().core.redirectTo({
                    url: "/pages/coupon-list/coupon-list"
                  });
                }else{
                  o.showToast({
                    title: '领取失败'
                  });
                }
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    goodsList: function(t) {
        var e = t.currentTarget.dataset.goods, o = [];
        for (var a in e) o.push(e[a].id);
        getApp().core.navigateTo({
            url: "/pages/list/list?goods_id=" + o
        });
    }
});