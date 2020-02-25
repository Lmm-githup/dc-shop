//毫秒转换成秒1e3=1*10=1000的三次方
function time() {
    var t = Math.round(new Date().getTime() / 1e3);
    return parseInt(t);
}
//获取时间":"
function formatTime(t) {
    var e = t.getFullYear(), r = t.getMonth() + 1, n = t.getDate(), a = t.getHours(), o = t.getMinutes(), u = t.getSeconds();
    return [ e, r, n ].map(formatNumber).join("/") + " " + [ a, o, u ].map(formatNumber).join(":");
}
//获取时间"-"
function formatData(t) {
    var e = t.getFullYear(), r = t.getMonth() + 1, n = t.getDate();
    t.getHours(), t.getMinutes(), t.getSeconds();
    return [ e, r, n ].map(formatNumber).join("-");
}

function formatNumber(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

module.exports = {
    formatTime: formatTime,
    formatData: formatData,
    scene_decode: function(t) {
        var e = (t + "").split(","), r = {};
        for (var n in e) {
            var a = e[n].split(":");
            0 < a.length && a[0] && (r[a[0]] = a[1] || null);
        }
        return r;
    },
    time: time,
    //有关url编码
    objectToUrlParams: function(t, e) {
        var r = "";
        for (var n in t) r += "&" + n + "=" + (e ? encodeURIComponent(t[n]) : t[n]);
        return r.substr(1);
    },
    //返回t里面是否存在e，是就返回true，不是就返回false
    inArray: function(e, t) {
        return t.some(function(t) {
            return e === t;
        });
    },
    // 比较两个大小，返回小
    min: function(t, e) {
        return t = parseFloat(t), (e = parseFloat(e)) < t ? e : t;
    },
    // 比较两个大小，返回大
    max: function(t, e) {
        return (t = parseFloat(t)) < (e = parseFloat(e)) ? e : t;
    }
};