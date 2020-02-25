module.exports = function() {//从内存中获取用户信息
    var t = this.core.getStorageSync(this.const.USER_INFO);
    return t || "";
};