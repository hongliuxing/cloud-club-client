import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
import uploadFile from "../../../utils/upload/support.js";
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let info = wx.getStorageSync("userInfo");
  },
  //获取input值
  onChange(e) {
    this.setData({
      [e.detail.name]: e.detail.value
    })
  },

  //获取textarea值
  change(e){
    this.setData({
      content:e.detail.value
    })
  },
  //提交
  onSubmit() {
    if (this.data.title == "") {

      app.globalData.toast("请输公告标题")

      return
    }
    if (this.data.content == "") {

      app.globalData.toast("请输入公告内容")

      return
    }
    let data = {
      club_id: wx.getStorageSync("associationInfo").id,
      content: this.data.content,
      title: this.data.title
    }
    Actions.doPost({
      url: URLs.CLUBMASTER_NOTICE_ADD,
      data: data
    }).then(res => {

      app.globalData.goBack({ title: "发布成功" })

    }).catch(error => {

    })

  },

 
})