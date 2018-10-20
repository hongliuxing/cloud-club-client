import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let item = wx.getStorageSync("associationInfo");
    if (item) {
      that._request(item.id)
    }
  },
  //社团联系人请求
  _request(clubid) {
    Actions.doGet({
      url: URLs.CLUB_DETAIL_INFO,
      data: {
        clubid: clubid,
      }
    }).then(res => {
      that.setData({
        info:res.data.info
      })
    }).catch(error => {
    })
  }
})