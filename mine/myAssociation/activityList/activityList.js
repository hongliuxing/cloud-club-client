import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBtns: [],
    club_id:"",//社团id,
    struts:1,

    //已发布分页相关
    publishedList:[],
    publishedPagenum:1,
    publishedRefersh:true,

    //审核中分页相关
    auditList:[],
    auditPagenum:1,
    auditRefersh:true,

    //新的活动分页相关
    newActivityList:[],
    newActivityPagenum:1,
    newActivityRefersh:true,

    role_ability:""



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    let topBtns = [{
        title: "已发布",
        btype: "event",
        value: (e) => this.published(e)
      },
      {
        title: "审核中",
        btype: "event",
        value: (e) => this.audit(e)
      },
      {
        title: "新的活动",
        btype: "event",
        value: (e) => this.newActivity(e)
      }
    ];
    that.setData({
      topBtns: topBtns
    });
    let item = wx.getStorageSync("associationInfo");
    if (item){
     that.setData({
       club_id:item.id,
       role_ability: item.role_ability
     })
      that.published()
    }
  },

  //已发布
  published(){
    that.setData({
      struts: 1
    })
    if (that.data.publishedList.length==0){
         that._request({ struts: 1, pagenum: 1 })
      }else{
         return
      }

  },
  
  //审核中
  audit(){
    that.setData({
      struts: -1
    })
    if (that.data.auditList.length == 0) {
      that._request({ struts: -1, pagenum: 1 })
    } else {
      return
    }
  },

  //新的活动
  newActivity(){
    that.setData({
      struts: 0
    })
    if (that.data.newActivityList.length == 0) {
       that._request({ struts: 0, pagenum: 1 })
    } else {
      return
    }
  },

  _request({club_id = that.data.club_id, struts = that.data.struts, pagenum = 1}){
    let data = {
      club_id: club_id,
      struts: struts,
      pagenum: pagenum
    }
    Actions.doGet({
      url: URLs.CLUBMASTER_ACTIVITY_LIST,
      data: data
    }).then(res => {

      console.log(res,"77777777777777")

    }).catch(error => {

    })
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