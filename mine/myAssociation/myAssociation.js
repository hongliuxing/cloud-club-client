import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more:false,//临时使用,
    pagenum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    Actions.doGet({
      url: URLs.CLUB_DETAIL_LIST,
      data: {pagenum:that.data.pagenum}
    }).then(res=>{
      console.log(res,"888888")
    }).catch(error=>{

    })
  },
  //前往社团入驻
  associationEnter(){
    app.globalData.goToPage("./associationEnter/associationEnter")
  },

  //加入社团
  joinGroup(){
    app.globalData.goToPage("./joinGroup/joinGroup")
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})