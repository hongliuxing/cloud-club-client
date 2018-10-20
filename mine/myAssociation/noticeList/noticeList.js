import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clubid:"",
    pagenum:1,
    refresh:true,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     that = this;
    let info = wx.getStorageSync("associationInfo");
    if (info){
      that.setData({
        clubid: info.id
      })
      that._request({clubid:info.id})     
    }
  },

  //请求
  _request({clubid = this.data.clubid, pagenum = this.data.pagenum}){
    let arr = pagenum==1?[]:that.data.list;
    Actions.doGet({
      url: URLs.CLUB_NOTICE_LIST,
      data: {
        clubid: clubid,
        pagenum: pagenum
       }
    }).then(res => {
      arr = arr.concat(res.data.list)
      if(res.data.list.length>0){
         that.setData({
           refresh:true
         })
      }else{
        that.setData({
          refresh: false
        })
      }
      that.setData({
        list: arr,
        pagenum: pagenum
      })
      wx.stopPullDownRefresh()
    }).catch(error => {

    })
  },
 
  //跳转详情
  goTo(){
    app.globalData.goToPage("../noticeInfo/noticeInfo")
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that._request({pagenum:1})
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (that.data.refresh){
      that._request({ pagenum: that.data.pagenum+1 })
     }
  },
})