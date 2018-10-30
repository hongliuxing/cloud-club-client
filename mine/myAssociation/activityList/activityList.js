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
    let user = wx.getStorageSync("userInfo")
    if (item){
      that.setData({
        club_id:item.id,
        role_ability: item.role_ability,
        userId:user.id
      })
      wx.showLoading({ title: '正在加载...', mask: true });
      that.published()
    }
  },

  onShow(){ 
    if(wx.getStorageSync("isActivityRefersh")){
      that._request({})
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
  
  //请求
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
      wx.hideLoading()
      
      if (struts == 1) {
        
        let publishedList = pagenum == 1 ? [] : this.data.publishedList; //已发布
        publishedList = publishedList.concat(res.data.list)
        if (res.data.list.length > 0) {
          that.setData({
            publishedRefersh: true,
          })
        } else {
          that.setData({
            publishedRefersh: false,
          })
        }
       
        that.setData({
          publishedPagenum: pagenum,
          publishedList: publishedList
        })

      } else if(struts==-1) {
        let auditList = pagenum == 1 ? [] : this.data.auditList; //审核中
        auditList = auditList.concat(res.data.list)
        if (res.data.list.length > 0) {
          that.setData({
            auditRefersh: true
          })
        } else {
          that.setData({
            auditRefersh: false
          })
        }

        that.setData({
          auditPagenum: pagenum,
          auditList: auditList,
        })
      }else{
        let newActivityList = pagenum == 1 ? [] : this.data.newActivityList; //新的活动
        newActivityList = newActivityList.concat(res.data.list)
        if (res.data.list.length > 0) {
          that.setData({
            newActivityRefersh: true
          })
        } else {
          that.setData({
            newActivityRefersh: false
          })
        }

        that.setData({
          newActivityPagenum: pagenum,
          newActivityList: newActivityList,
        })
      }
      wx.stopPullDownRefresh()
    }).catch(error => {

    })
  },

  //添加 
  add(){
    wx.removeStorageSync("isActivityRefersh")
    let data = {
      isAdd: 1
    }
    app.globalData.goToPage("../activityAdd/activityAdd?data=" + JSON.stringify(data))
  },
 
  //已发布撤销活动
  onRevocation(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let arr = that.data.publishedList;
    that.back(id, index, arr,1)
  },
  //审核中回撤
  goBack(e){
    let id = e.detail.id;
    let index = e.detail.index;
    let arr = that.data.auditList;
    that.back(id, index, arr,2)
  },
  //回撤公用
  back(id, index, arr, isAudit) { //isAudit判断是哪个列表

    wx.showModal({
      title: '提示',
      content: '确定要撤销此活动吗?',
      success: function (res) {
        if (res.confirm) {
          Actions.doPost({
            url: URLs.CLUBMASTER_ACTIVITY_REPEAL,
            data: {
              activity_id: id
            }
          }).then(res => {
            arr.splice(index, 1)
            if (isAudit==1){
              that.setData({
                publishedList: arr
              })
            }else{
              that.setData({
                auditList: arr
              })
            }
            app.globalData.toast("撤销成功")
          }).catch(error => {

          })
        }
      }
    })
  },
  //查看
  onGoInfo(e){
    wx.removeStorageSync("isActivityRefersh")
   let id = e.detail.id;
   let data = {
     id: id,
     isLook:2,
     isAdd: 2
   }
    app.globalData.goToPage("../activityAdd/activityAdd?data=" + JSON.stringify(data))

  },
  //编辑
  onEdit(e){
    wx.removeStorageSync("isActivityRefersh")
    let id = e.detail.id;
    let data = {
      id: id,
      isLook: 1,
      isAdd: 2
    }
    app.globalData.goToPage("../activityAdd/activityAdd?data=" + JSON.stringify(data))
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
    if (that.data.struts == 1) {
      if (that.data.publishedRefersh) {
        that._request({ pagenum: that.data.publishedPagenum + 1 })
        wx.showLoading({ title: '加载更多...', mask: true });
      }
    } else if (that.data.struts == -1) {
      if (that.data.auditRefersh) {
        that._request({ pagenum: that.data.auditPagenum + 1 })
        wx.showLoading({ title: '加载更多...', mask: true });
      }
    } else {
      if (that.data.newActivityRefersh) {
        that._request({ pagenum: that.data.newActivityPagenum + 1 });
        wx.showLoading({ title: '加载更多...', mask: true });
      }
    }
  },
})