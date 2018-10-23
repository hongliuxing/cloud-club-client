import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fifterList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that._request()
    wx.removeStorageSync("associationInfo")
    wx.showLoading({
      title: '正在运送社团活动...', mask: true
    })
  },
  //前往社团入驻
  associationEnter() {
    app.globalData.goToPage("./associationEnter/associationEnter")
  },

  //加入社团
  joinGroup() {
    app.globalData.goToPage("./joinGroup/joinGroup")
  },

  _request() {
    Actions.doGet({
      url: URLs.CLUB_DETAIL_LIST,
      data: {}
    }).then(res => {
      wx.hideLoading()
        that.setData({
          fifterList: that._filterArr(res.data.list),
        })
    }).catch(error => {

    })
  },

  //过滤整合 
  _filterArr(arr) {
    //添加身份标记, 我负责的,我参与的
    let master = [],
      no_master = [];
    Array.isArray(arr) && arr.forEach(item => {
      if (item.is_master === "true") {
        if (master.length===0){
          master.unshift({
            type: "master",
            text: "我负责的社团"
          })
        }

        master.push(item)

      } else if (item.is_master === "false") {
        if (no_master.length === 0) {
          no_master.unshift({
            type: "master",
            text: "我参与的社团"
          })
        }
        no_master.push(item)

      }
    });
    return master.concat(no_master)

  },

  //社团详情
  goTo(e){
    let item = e.detail.item;
    wx.setStorageSync("associationInfo", item)
    app.globalData.goToPage("./associationInfo/associationInfo")
  }
})