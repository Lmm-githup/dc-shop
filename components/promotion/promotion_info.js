module.exports = {
  currentPage: null,
  init: function (t) {
    var a = this;
    void 0 === (a.currentPage = t).showPromotionPicker && (t.showPromotionPicker = function (t) {
      a.showPromotionPicker(t);
    }), void 0 === t.hidePromotionPicker && (t.hidePromotionPicker = function (t) {
      a.hidePromotionPicker(t);
    });
  },
  hidePromotionPicker: function () {
    this.currentPage.setData({
      show_promotion_picker: !1
    });
  },
  showPromotionPicker: function () {
    this.currentPage.setData({
      show_promotion_picker: !0
    });
  }
};