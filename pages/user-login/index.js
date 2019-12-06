Page({
    data: {
      seconds: 0, // 读秒
      timer: '', // 计时器
      text: '获取验证码',
      code: '',
      phone: '',
    },
    getCode: function(e){
      var t = this;
      if (t.data.text != '获取验证码'){
        return;
      }
      if (!t.isPoneAvailable()){
        t.showToast({
          title: '请输入手效的手机号'
        });
        return;
      }
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        mask: true,
        duration: 20000
      })
      getApp().request({
        url: getApp().api.ext.get_sms,
        data: {
          phone: t.data.phone
        },
        success: function (a) {
          wx.hideToast();
          if (0 == a.code) {
            t.showToast({
              title: '验证码已发送'
            });
            t.loadTime();
          }else{
            t.showToast({
              title: a.msg
            });
          }
        }
      })
    },
  bindKeyInput: function(e){
     this.setData({
       phone: e.detail.value
     });
  },
   isPoneAvailable: function() {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if(!myreg.test(this.data.phone)) {
        return false;
      } else {
          return true;
      }
    },
    loadTime:function(e){
      let that = this;
      // 开始倒计时
      that.setData({
        seconds: 60,
        timer: setInterval(function () {
          let seconds = that.data.seconds
          that.setData({ 
            seconds: seconds - 1,
            text: (seconds - 1)+'秒'
          })
          if (that.data.seconds == 0) {
            // 读秒结束 清空计时器
            clearInterval(that.data.timer);
            that.setData({
              text: '获取验证码'
            })
          }
        }, 1000)
      })
    },
  bindCode: function(e){
    this.setData({
      code: e.detail.value
    });
  },
  savePhone: function(e){
    let t = this;
    if (!t.data.phone || !t.isPoneAvailable() || !t.data.code){
      t.showToast({
        title: '信息不完整'
      });
      return;
    }
    wx.showToast({
      title: '保存中...',
      icon: 'loading',
      mask: true,
      duration: 20000
    })
    getApp().request({
      url: getApp().api.ext.update_phone,
      data: {
        phone: t.data.phone,
        code: t.data.code
      },
      success: function (a) {
        wx.hideToast();
        if (0 == a.code) {
          t.showToast({
            title: '保存成功'
          });
          getApp().core.redirectTo({
            url: "/pages/user/user"
          });
        } else {
          t.showToast({
            title: a.msg
          });
        }
      }
    })
  },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this);
    },
});