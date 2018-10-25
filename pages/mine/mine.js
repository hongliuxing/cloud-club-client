import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlSchool: "../../mine/editSchool/editSchool",
    myAssociation: "../../mine/myAssociation/myAssociation",
    luckExplain: "../../mine/luckExplain/luckExplain",
    sportExplain: "../../mine/sportExplain/sportExplain",
    info: {},
    school: null,
    status: null, //学校状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    wx.showLoading({ title: '正在组装社团...', mask: true });
    that._request()
  },

  //请求
  _request() {
    Actions.doGet({
      url: URLs.USER_PANEL_INFO,
      data: {}
    }).then(res => {
     wx.hideLoading()
      let status = res.data.info.school_struts;
      let name = "";
      if (status == 1) {
        name = "已通过"
      } else if (status == 0) {
        name = "申请中"
      } else if (status == -1) {
        name = "未通过"
      } else {
        name = "未设置"
      }

      that.setData({
        info: res.data.info,
        school: name,
        status: status
      })

      wx.setStorageSync("userInfo", res.data.info)
    }).catch(err => {
      console.log('我的社团 err: ', err);
    });
  },
  //修改信息页面
  goToUser() {
    app.globalData.goToPage("../../mine/person/person?userinfo=" + JSON.stringify(this.data.info))
  },
  //页面跳转
  goTo(e) {
    if (this.data.myAssociation == e.detail.url) {
      if (this.data.status !== 1 ) {
        app.globalData.toast("学校设置未通过")
        return
      }
    }
    app.globalData.goToPage(e.detail.url)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (wx.getStorageSync("mineRefresh")) {
      that._request()
    }
  },

})