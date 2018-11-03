import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
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
    gender: 1,
    sexArr: ['小姐姐', "小哥哥"],
    mobile: "",
    detail: "",
    is_default: 0,
    schoolArea: "",
    avatarUrl: "",

    disabled: false,
    phoneNum: "",
    smscode: "",
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let uinfo = wx.getStorageSync('userInfo');
    let phone = wx.getStorageSync('phone');
    if (uinfo){
      that.setData({
        gender: uinfo.gender || 0,
        avatar_url: uinfo.avatar_url,
        nickname: uinfo.nickname,
        telephone: phone || ""
      })
    }
    wx.removeStorageSync("mineRefresh")
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
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo){
      that.setData({
        telephone: userInfo.telephone || ""
      })
    }
  },
  //获取昵称
  onChangeName(e){
    that.setData({
      nickname:e.detail.value
    })
  },
  //获取头像
  bindgetuserinfo(e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      that.setData({
        nickname:e.detail.userInfo.nickName,
        avatar_url: e.detail.userInfo.avatarUrl
      })
    }
  },
  //跳转
  goTo() {
    app.globalData.goToPage("./editPhone/editPhone?phone=" + this.data.telephone)
  },
  //修改属性
  chang(e) {
    this.setData({
      gender: Number(e.detail.value)
    })
  },
  //提交
  onSubmit() {

    let data = {
      nickname: this.data.nickname,
      avatar_url: this.data.avatar_url,
      gender: this.data.gender
    }
    Actions.doPost({
      url: URLs.USER_SAVE,
      data: data
    }).then(res=>{
       // 先提示修改成功
        wx.showToast({
            title: '保存成功!',
            icon: 'success',
            duration: 1500,
            mask: true,
            success: function(res) {
                let uinfo = wx.getStorageSync('userInfo');
                if (uinfo){
                    uinfo.nickname = data.nickname;
                    uinfo.avatar_url = data.avatar_url;
                    uinfo.gender = data.gender;
                    wx.setStorageSync('userInfo', uinfo);
                }else{
                  wx.setStorageSync('userInfo', data);
                }
                wx.setStorageSync("mineRefresh", true);
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1
                  })
                },1000)
            }
        })
        
    }).catch(error=>{

    })
  },
  //上传照片
  changeImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '正在上传',
          mask: true,
        })
        Actions.uploadSign.pid(res.tempFilePaths[0])
          .then((uploadRes) => {
            if (uploadRes.errMsg == "uploadFile:ok") {
              that.setData({
                avatar_url: uploadRes.pic
              })
              wx.hideLoading()
              app.globalData.toast("上传成功")
            }
          })
          .catch(err => {
            wx.hideLoading()
            app.globalData.toast("上传错误")
          });
      },
    })

  }

})