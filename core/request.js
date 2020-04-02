module.exports = function(a) {
    a.data || (a.data = {});
    // 获取core
    var o = this.core, 
    // 获取access_token
    e = this.core.getStorageSync(this.const.ACCESS_TOKEN), 
    // 获取form_id_list
    t = this.core.getStorageSync(this.const.FORM_ID_LIST);
    // 把a.data存入access_token
    e && (a.data.access_token = e), 
    // 把a.data存入_version版本
    a.data._version = this._version, 
    // 把a.data存入platform
    a.data._platform = this.platform;
    // 如果this.is_login=flase且currentPage存在就设置this.is_login为true,并且执行this.login()
    !this.is_login && this.page.currentPage && (this.is_login = !0,this.login({}));//这个请求了是否登陆过的接口
    var s = this;
    t && 1 <= t.length && s.is_form_id_request && (s.is_form_id_request = !1, s.request({
        url: s.api.default.form_id,
        method: "POST",
        data: {
            formIdList: JSON.stringify(t)
        },                     
        success: function(e) {
            s.core.removeStorageSync(s.const.FORM_ID_LIST);
        },
        complete: function() {
            s.is_form_id_request = !0;
        }
    })),
     o.request({
        url: a.url,
        header: a.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: a.data || {},
        method: a.method || "GET",
        dataType: a.dataType || "json",
        success: function(e) {
            // 如果请求接口的code==-1的话setUserInfoShow(user-info-show=true)是显示去登陆的页面is_login=false
            -1 == e.data.code ? (s.core.hideLoading(), s.page.setUserInfoShow(), s.is_login = !1) : -2 == e.data.code ? o.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : a.success && a.success(e.data);
        },
        fail: function(e) {
            if (console.warn("--- request fail >>>"), console.warn("--- " + a.url + " ---"), 
            console.warn(e), console.warn("<<< request fail ---"), a && a.noHandlerFail) "function" == typeof a.fail && a.fail(e.data); else {
                var t = getApp();
                t.is_on_launch ? (t.is_on_launch = !1, o.showModal({
                    title: "网络请求出错",
                    content: e.errMsg || "",
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && a.fail && a.fail(e);
                    }
                })) : (o.showToast({
                    title: e.errMsg,
                    image: "/images/icon-warning.png"
                }), a.fail && a.fail(e));
            }
        },
        complete: function(t) {
            if (200 != t.statusCode && t.data && t.data.code && 500 == t.data.code) {
                var e = t.data.data.message;
                o.showModal({
                    title: "系统错误",
                    content: e + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
                    cancelText: "关闭",
                    confirmText: "复制",
                    success: function(e) {
                        e.confirm && o.setClipboardData({
                            data: JSON.stringify({
                                data: t.data.data,
                                object: a
                            })
                        });
                    }
                });
            }
            a.complete && a.complete(t);
        }
    });
};