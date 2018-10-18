import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more: false, //临时使用,
    pagenum: 1,
    list: [],
    refresh: true,
    principal:false,// 负责下边线，
    jion:false,//参加的下边线
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that._request(1)
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
        /**
         * 判断列表下边是否有边线数组空则没有
         */
      //  for(let i = 0; i < arr.length;i++){
      //    if (arr[i].is_master=="true"){
      //          that.setData({
      //            principal:true
      //          })
      //          break;
      //     }else{
      //         that.setData({
      //           principal: false
      //         })
      //     }
      //    if (arr[i].is_master == "false") {
      //      that.setData({
      //        jion: true
      //      })
      //      continue;
      //    } else {
      //      that.setData({
      //        jion: false
      //      })
      //    }
    
      //   }

        that.setData({
          list: arr,
          pagenum: pageindex
        })
        wx.stopPullDownRefresh()
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
    that._request(1)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(this.data.refresh,"this.data.refresh")
    if (this.data.refresh){
       that._request(this.data.pagenum+1)
    }
  },
})