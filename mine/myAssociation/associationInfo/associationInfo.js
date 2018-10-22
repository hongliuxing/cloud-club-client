import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
import {
  onStartAnimation,
  onCloseAnimation
} from "../../../utils/upload/public.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: null,
    clubid: "",
    pagenum: 1,
    list: [],
    filterList: [],
    refresh: true,
    disabled: true, //判读身份显示,
    title: "",
    school: "",
    newjoin_count:"",//入团申请
    notice_count:"",//公告数量
    userId:"",
    role_ability:"",//本人社团身份状态
    items: [{ name: "升权", value: 1, dis: false }, { name: "降权", value: -1, dis: false}, { name: "转让社长", value: 0, dis:true}],
    diff:"",//升降权
    animationData: {},
    animationMask: {},
    visable: false,
    target_client:"",
    updatedAt:"",
    roleAbility:"",//被操作者的目前的身份

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    let item = wx.getStorageSync("associationInfo");
    if (item) {
      that.setData({
        clubid: item.id,
        title: item.title,
        school: item.uName,
        disabled: item.is_master == "true" ? true : false,
        userId: wx.getStorageSync("userInfo").id,
        role_ability: item.role_ability,
      })
      that._request({
        clubid: item.id
      })
      that._panelReauest(item.id)
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width: res.screenWidth
        })
      },
    })


  },
  //公告列表
  goTo_notice(){
    app.globalData.goToPage("../noticeList/noticeList")
  },

  //申请入社列表
  goTo_applyList(){
    app.globalData.goToPage("../applyList/applyList")
  },
  
  //面板提示信息
  _panelReauest(clubid){
    let lastReadNotice = wx.getStorageSync("last_read_notice")
    Actions.doGet({
        url: URLs.CLUB_PANEL_TIPS,
        data:{
          last_read_notice: lastReadNotice ? lastReadNotice:"",
          clubid: clubid
        }
    }).then(res=>{
      that.setData({
        newjoin_count: res.data.info.newjoin_count || 0,
        notice_count: res.data.info.notice_count
      })
    }).catch(error=>{

    })
  },

  //社团联系人请求
  _request({
    clubid = that.data.clubid,
    pagenum = that.data.pagenum
  }) {
    let arr = pagenum == 1 ? [] : that.data.list;
    Actions.doGet({
      url: URLs.CLUB_CONTACT_LIST,
      data: {
        clubid: clubid,
        pagenum: pagenum
      }
    }).then(res => {
      if (res.data.list > 0) {
        that.setData({
          refresh: true
        })
      } else {
        that.setData({
          refresh: false
        })
      }
      arr = arr.concat(res.data.list)
      that.setData({
        list: arr,
        filterList: that._filterArr(arr),
        pagenum: pagenum
      })
      wx.stopPullDownRefresh();
    }).catch(error => {

    })
  },

  //过滤整合 
  _filterArr(arr) {
    //添加身份标记, 社长，副社长，部长，新媒体，成员
    let proprieter = [],
      deputyDirector = [],
      minister = [],
      media = [],
      member = [];
    Array.isArray(arr) && arr.forEach(item => {
      if (item.role_ability === 4) {
        if (proprieter.length === 0) {
          proprieter.unshift({
            type: 4,
            text: "社长"
          })
        }
        proprieter.push(item)

      } else if (item.role_ability === 3) {
        if (deputyDirector.length === 0) {
          deputyDirector.unshift({
            type: 3,
            text: "副社长"
          })
        }
        deputyDirector.push(item)

      } else if (item.role_ability === 2) {
        if (minister.length === 0) {
          minister.unshift({
            type: 2,
            text: "部长"
          })
        }
        minister.push(item)
      } else if (item.role_ability === 1) {
        if (media.length === 0) {
          media.unshift({
            type: 1,
            text: "新媒体"
          })
        }
        media.push(item)
      } else if (item.role_ability === 0) {
        if (member.length === 0) {
          member.unshift({
            type: 1,
            text: "成员"
          })
        }
        member.push(item)
      }
    });
    return proprieter.concat(deputyDirector, minister, media, member)

  },
  //甚至权限
  setPower(e){
    if (that.data.role_ability==4){
        that.setData({
          visable:true,
          target_client:e.currentTarget.dataset.id,
          updatedAt: e.currentTarget.dataset.time,
          roleAbility: e.currentTarget.dataset.roleAbility
        })
      onStartAnimation(that, -300, 0)
    }else{
      app.globalData.toast("只有本社团社长才可操作")
    }
     
  },
  //升降权值
  radioChange(e){
     that.setData({
       diff: e.detail.value
     })
  },
  //升降权------取消
  onCacel() {
    onCloseAnimation(that, 0, -300)
  },
  //升降权-----确定
  onOk() {
    if (that.data.reason == "") {
      app.globalData.toast("请选择升降权")
      return
    }
    if (Number(that.data.diff)===1 ){
      if (that.data.roleAbility==3){
        app.globalData.toast("权限已升至最大")
        return
     }
    }
    if (Number(that.data.diff) === -1) {
      if (that.data.roleAbility == 0) {
        app.globalData.toast("权限降至最小")
        return
      }
    }
    Actions.doPost({
      url: URLs.CLUBMASTER_SET_POWER,
      data: {
        diff: Number(that.data.diff) ,
        club_id: that.data.clubid,
        target_client: that.data.target_client,
        updatedAt: that.data.updatedAt
      }
    }).then(res => {
      that._request({pagenum: 1 })
      onCloseAnimation(that, 0, -300)
      app.globalData.toast("设置成功")
    }).catch(error => {
        console.log(error)
    })
  },
  //拨打电话
  onCall(e) {
    if (e.target.dataset.phone) {
      wx.makePhoneCall({
        phoneNumber: e.target.dataset.phone,
        success: function(res) {},
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    that._request({
      pagenum: 1
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.refresh) {
      this._request({
        pagenum: this.data.pagenum + 1
      })
    }
  }

})