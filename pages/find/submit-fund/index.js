var api = getApp().api

Page({
  data: {
    image_list: [],
    disabled: true
  },
  formSubmit: function(e){
    var t = this;
    if(!t.data.disabled){
      return;
    }
    t.setData({ disabled: false });
    var productName = e.detail.value.productName;
    var phone = e.detail.value.phone;
    var stock = e.detail.value.stock;
    var productSpec = e.detail.value.productSpec;
    var manufacturer = e.detail.value.manufacturer;
    if (!productName || !phone || !stock || !productSpec || !manufacturer){
      t.showToast({
        title: '请填写完整'
      });
      t.setData({ disabled: true });
      return;
    }
    
    var comments = e.detail.value.comments;
    var contactName = e.detail.value.contactName;
    var productImages = "";
    if(t.data.image_list.length > 0){
      for(var i=0;i<t.data.image_list.length;i++){
        productImages += t.data.image_list[i];
        if(i < t.data.image_list.length -1){
          productImages+=",";
        }
      }
    }
   
    getApp().core.showLoading({
      title: "提交中"
    }), 
    getApp().request({
      url: getApp().api.ext.submit_fund,
      data: {
        productName: productName,
        productSpec: productSpec,
        manufacturer: manufacturer,
        comments: comments,
        contactName: contactName,
        phone: phone,
        stock: stock,
        productImages: productImages
      },
      success: function (o) {
        if(0 == o.code){
          getApp().core.showModal({
            title: "提示",
            content: '提交成功',
            success: function () {
              getApp().core.redirectTo({
                url: "/pages/find/fund/index"
              });
            }
          });
        }else{
          getApp().core.showModal({
            title: "提示",
            content: '提交失败',
            success: function () { }
          });
          t.setData({ disabled: true });
        }
      },
      fail: function(){
         t.setData({ disabled: true });
      },
      complete: function () {
        getApp().core.hideLoading();
      }
    });
  },
  onLoad: function(e) {
    getApp().page.onLoad(this, e);
  },
  chooseImage: function(){
    var that = this;
    wx.chooseImage({
      count: 1,  //最多可以选择的图片总数
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        var token = getApp().core.getStorageSync("ACCESS_TOKEN");
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: getApp().api.ext.upload + "&access_token=" + token +"&_version=2.8.9&_platform=wx",
            filePath: tempFilePaths[i],
            name: 'uploadfile_ant',
            formData: {
              'imgIndex': i
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              uploadImgCount++;
              var imgs = that.data.image_list;
              imgs.push(data.data.url);
              that.setData({
                image_list: imgs
              });

              //如果是最后一张,则隐藏等待中
              if (uploadImgCount == tempFilePaths.length) {
                 wx.hideToast();
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
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