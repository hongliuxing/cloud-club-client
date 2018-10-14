let app = getApp();
let that;
let times;
let x = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    value: "修改电话",
    schoolData: {},
    nickName: "",
    gender: null,
    sexArr: ['小姐姐', "小哥哥"],
    mobile: "",
    detail: "",
    is_default: 0,
    schoolArea: "",
    avatarUrl: "",

    disabled: false,
    phoneNum: "",
    smscode: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let data = wx.getStorageSync("userInfo")
    if (data){
      that.setData({
        nickName: data.nickName,
        avatarUrl: data.avatarUrl
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取头像
  bindgetuserinfo(e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      that.setData({
        nickName:e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl
      })
      let data = {
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl
      }
      wx.setStorageSync("userInfo", data)  
    }
  },
  //跳转
  goTo() {
    goToPage("../editPhone/editPhone")
  },
  //修改属性
  chang(e) {
    this.setData({
      gender: Number(e.detail.value)
    })
  },
  //提交
  onClick() {

  }

})