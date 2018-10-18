import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlSchool: "../../mine/editSchool/editSchool",
    myAssociation: "../../mine/myAssociation/myAssociation",
    luckExplain: "../../mine/luckExplain/luckExplain",
    sportExplain: "../../mine/sportExplain/sportExplain",
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    Actions.doGet({
      url: URLs.USER_PANEL_INFO,
      data: {}
    }).then(res => {
      that.setData({
        info: res.data.info
      })
      wx.setStorageSync("userInfo", res.data.info)
    }).catch(err => {
      console.log('我的社团 err: ', err);
    });
  },
  //修改信息页面
  goToUser() {
    app.globalData.goToPage("../../mine/person/person?userinfo=" + JSON.stringify(this.data.info))
  },
  //页面跳转
  goTo(e) {
    app.globalData.goToPage(e.detail.url)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})