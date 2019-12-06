var is_loading_more = !1, is_no_more = !1;

Page({
    data: {
        goods_list: [],
        price: 0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), this.loadData(t);
    },
    loadData: function(p) {
      var t = this;
      getApp().core.showLoading({
        title: "正在加载"
      });
      getApp().request({
        url: getApp().api.ext.promotion_set,
        data: {
          id: p.id
        },
        success: function (e) {
          if(0 == e.code){
            t.setData({
              goods_list: e.data.list,
              show_no_data_tip: (!e.data || !e.data.list || e.data.list.length == 0) ? true : false,
              price: e.data.price
            });
            wx.setNavigationBarTitle({
              title: e.data.name
            });
          }
        },
        complete: function () {
          getApp().core.hideLoading();
        }
      });
    },
    onReachBottom: function() {},
    onShow: function(t) {
        getApp().page.onShow(this); 
    },
});