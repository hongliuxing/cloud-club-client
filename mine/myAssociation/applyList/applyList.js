import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBtns: [],
    club_id:"",
    struts:0,
    pagenum:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    let topBtns = [{
        title: "审核中",
        btype: "event",
        value: (e) => this.Auditing()
      },
      {
        title: "已通过",
        btype: "event",
        value: (e) => this.pass()
      },
      {
        title: "未通过",
        btype: "event",
        value: (e) => this.no_pass()
      }
    ];
    this.setData({
      topBtns: topBtns
    });
    let item = wx.getStorageSync("associationInfo");
    if (item){
       let data = {
         club_id:item.id,
         struts:that.data.struts, 
         pagenum :that.data.pagenum
       }
       that._request(data)
    }

  },

  //审核中
  Auditing(){

  },
  
  //已通过
  pass(){

  },

  //未通过
  no_pass(){

  },

  _request({ club_id = that.data.club_id, struts = that.data.struts, pagenum = that.data.pagenum}){
   Actions.doGet({
     url: URLs.CLUBMASTER_JOIN_LIST,
     data:{
       club_id: club_id,
       struts : struts,
       pagenum : pagenum
     }
   }).then(res=>{
     console.log(res.data.list[0]["crole.profe"],"uuuuuuuuuuuuuuuu")
   }).catch(error=>{

   })
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