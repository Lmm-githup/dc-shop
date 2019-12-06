var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, is_loading_more = true;

Page({
    data: {
        cat_list: [],
        cat_id: '',
        scrollLeft: 0,
        goods_list: [],
        page: 1,
        cat_style: 0,
        height: 0,
        catheight: 120,
        sid: ''
    },
    onLoad: function(t) {
        var a = this;
        getApp().page.onLoad(a, t);
        a.setData({
          sid: t.id
        });
       this.loadData();
    },
    onShow: function() {
        getApp().page.onShow(this), getApp().core.hideLoading();
        
    },
    loadData: function(t) {
      var a = this;
      a.setData({goods_list:[] });
      getApp().request({
        url: getApp().api.ext.shop_cat,
        data: {
          shopId: a.data.sid
        },
        success: function (d) {
           if(0 == d.code){
             a.setData({
               cat_list: d.data.list,
               cat_id: d.data.currentId
             });
             wx.setNavigationBarTitle({
               title: d.data.shop.name
             });
             is_loading_more = true;
             a.setData({ show_no_data_tip: false });
             a.loadMoreGoodsList();
           } 
        }
      });
    },
    
    catItemClick: function(t) {
      var a = t.currentTarget.dataset.index, e = this.data.cat_list, o = null;
      for (var i in e) {
        if (i == a){
          e[i].active = true;
        }else{
          e[i].active = false;
        }
      }
      this.setData({cat_id: e[a].id,goods_list: [],cat_list: e});
      is_loading_more = true;
      this.setData({ show_no_data_tip: false });
      this.loadMoreGoodsList();
    },
    
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        this.loadMoreGoodsList();
    },
    loadMoreGoodsList: function() {
        var e = this;
      if (is_loading_more) {
          var t = e.data.cat_id || "", o = e.data.page || 2;
          getApp().core.showLoading({
            title: "加载中"
          }), 
            getApp().request({
                url: getApp().api.ext.shop_goods,
                data: {
                    page: o,
                    cat_id: t,
                    shopId: e.data.sid
                },
                success: function(t) {
                    if(t.code == 0 && t.data.list.length>0){
                      var a = e.data.goods_list.concat(t.data.list);
                      e.setData({
                          goods_list: a,
                          page: o + 1
                      });
                    }
                    is_loading_more = false;
                    if(e.data.goods_list.length == 0){
                      e.setData({ show_no_data_tip:true});
                    }
                },
                complete: function() {
                  getApp().core.hideLoading();
                }
            });
        }
    }
});