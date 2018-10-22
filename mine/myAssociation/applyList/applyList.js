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
    club_id: "",
    struts: 0,
    pagenum: 1,

    AuditingList: [], //审核相关
    AuditingRefersh: true,
    AuditingPagenum: 1,

    passList: [], //已通过
    passRefersh: true,
    passPagenum: 1,

    on_passList: [], //未通过通过
    on_passRefersh: true,
    on_passPagenum: 1,
   
    btn:true,//判断是否显示button

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
    if (item) {
        that.setData({
          club_id: item.id,
        })
      let data = {
        club_id: item.id,
        struts: that.data.struts,
        pagenum: that.data.pagenum
      }
      wx.showLoading({ title: '正在加载...', mask: true });
      that._request(data)
    }

  },

  //审核中
  Auditing() {
    that.setData({
      struts: 0,
      btn:true
    })

    if(this.data.AuditingList.length==0){

      that._request({ struts: 0, pagenum:1})

    }else{
      return
    }
  },

  //已通过
  pass() {
    that.setData({
      struts: 1,
      btn: false
    })
    if (this.data.passList.length == 0) {

      that._request({ struts: 1, pagenum: 1 })

    } else {
      return
    }
  },
  //未通过
  no_pass() {
    that.setData({
      struts: -1,
      btn: false
    })
    if (this.data.on_passList.length == 0) {

      that._request({ struts: -1, pagenum: 1 })

    } else {
      return
    }
  },
  //批准
  onAgree(e){
    wx.showModal({
      title: '提示',
      content: '',
    })
    return
    let id = e.currentTarget.dataset.applyId;
    let apply_client_id = e.currentTarget.dataset.applyClientId;
    let name = e.currentTarget.dataset.name;
    Actions.doPost({
      ulr: URLs.CLUBMASTER_JOIN_RATIFY,
      data:{
        apply_id:id,
        club_id: that.data.club_id,
        apply_client_id: apply_client_id
      }
    }).then(res=>{
      
    }).catch(error=>{

    })

  },
  //拒绝
  onRefuse(e){
    let id = e.currentTarget.dataset.applyId;
    let apply_client_id = e.currentTarget.dataset.applyClientId;
    Actions.doPost({
      ulr: URLs.CLUBMASTER_JOIN_REJECT,
      data: {
        apply_id: id,
        club_id: that.data.club_id,
        apply_client_id: apply_client_id
      }
    }).then(res => {

    }).catch(error => {

    })
  },
  //请求
  _request({
    club_id = that.data.club_id,
    struts = that.data.struts,
    pagenum = that.data.pagenum
  }) {
    let arr;
    if (struts == 0) {
      arr = pagenum == 1 ? [] : that.data.AuditingList;
    } else if (struts == 1){
      arr = pagenum == 1 ? [] : that.data.passList;
    }else{
      arr = pagenum == 1 ? [] : that.data.on_passList;
    }

    Actions.doGet({
      url: URLs.CLUBMASTER_JOIN_LIST,
      data: {
        club_id: club_id,
        struts: struts,
        pagenum: pagenum
      }
    }).then(res => {
      wx.hideLoading()
      arr = arr.concat(res.data.list)
      if (res.data.list.length>0){
        if (struts == 0) {
          that.setData({
            AuditingRefersh: true,
            AuditingList:arr,
            AuditingPagenum: pagenum
          })
        } else if (struts == 1) {
          that.setData({
            passRefersh: true,
            passList:arr,
            passPagenum: pagenum
          })
        } else {
          that.setData({
            on_passRefersh: true,
            on_passList:arr,
            on_passPagenum: pagenum
          })
        }
      }else{
        if (struts == 0) {
          that.setData({
            AuditingRefersh: false,
            AuditingPagenum: pagenum
          })
        } else if (struts == 1) {
          that.setData({
            passRefersh: false,
            passPagenum: pagenum
          })
        } else {
          that.setData({
            on_passRefersh: false,
            on_passPagenum: pagenum
          })
        }
      }
      wx.stopPullDownRefresh()
    }).catch(error => {

    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    that._request({ pagenum: 1 })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (that.data.struts == 0) {
      if (that.data.AuditingRefersh){
        that._request({ pagenum: that.data.AuditingPagenum+1 })
        wx.showLoading({ title: '加载更多...', mask: true });
        }
    } else if (struts == 1) {
      if (that.data.passRefersh) {
        that._request({ pagenum: that.data.passPagenum + 1 })
        wx.showLoading({ title: '加载更多...', mask: true });
      }
    } else {
      if (that.data.on_passRefersh) {
        that._request({ pagenum: that.data.on_passPagenum + 1 });
        wx.showLoading({ title: '加载更多...', mask: true });
      }
    }
  },

})