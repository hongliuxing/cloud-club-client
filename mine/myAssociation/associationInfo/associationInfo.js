import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
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
    userId:""

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
        userId: wx.getStorageSync("userInfo").id
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