Page({
    data: {
        user_info: {},
        array:[
          '男','女'
        ],
        sex: '',
        birthday:'',
        email: ''
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    loadData: function(e) {
      var t = this;
      getApp().request({
        url: getApp().api.user.info,
        success: function (a) {
          if (0 == a.code) {
             t.setData({
               user_info: a.data,
               email: a.data.email,
               sex: a.data.sex,
               birthday: a.data.birthday
             });
          }
        }
      })
    },
  bindPickerChange: function (e) {
    var t = this;
    this.setData({
      sex: t.data.array[e.detail.value]
    })
  },
  bindDateChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  goAddress: function(e){
    getApp().core.navigateTo({
      url: "/pages/address/address"
    });
  },
  bindKeyInput: function(e){
    this.setData({
      email: e.detail.value
    })
  },
  updatePhone: function(e){
    getApp().core.navigateTo({
      url: "/pages/update-phone/index"
    });
  },
  saveUser:function(e){
    var t = this;
    if (t.data.email){
      var emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (!emailReg.test(t.data.email)){
        t.showToast({
          title: '请输入正确的邮箱地址'
        });
        return;
      }
    }
    getApp().request({
      url: getApp().api.ext.save_user,
      data: {
        email: t.data.email == 'null' ? '' : t.data.email,
        sex: t.data.sex == 'null' ? '' : t.data.sex,
        birthday: t.data.birthday == 'null' ? '' : t.data.birthday,
      },
      success: function (a) {
        getApp().core.showModal({
          title: "提示",
          content: a.msg,
          showCancel: false,
          confirmText: "确认",
          success: function (t) {

          }
        });
      }
    })
  },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this);
        this.loadData();
    },
});