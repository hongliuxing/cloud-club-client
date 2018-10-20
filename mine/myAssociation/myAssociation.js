import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagenum: 1,
    list: [],
    refresh: true,
    fifterList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that._request(1)
    wx.removeStorageSync("associationInfo")
  },
  //前往社团入驻
  associationEnter() {
    app.globalData.goToPage("./associationEnter/associationEnter")
  },

  //加入社团
  joinGroup() {
    app.globalData.goToPage("./joinGroup/joinGroup")
  },

  _request(pageindex) {
    let arr = pageindex==1?[]:that.data.list;
    Actions.doGet({
      url: URLs.CLUB_DETAIL_LIST,
      data: {
        pagenum: pageindex
      }
    }).then(res => {
       arr = arr.concat(res.data.list)
        if (res.data.list.length > 0) {
          that.setData({
            refresh: true,
          })
        } else {
          that.setData({
            refresh: false,
          })
        }
        that.setData({
          list: arr,
          fifterList: that._filterArr(arr),
          pagenum: pageindex
        })
        wx.stopPullDownRefresh()
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
    that._request(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.refresh){
       that._request(this.data.pagenum+1)
    }
  },
})