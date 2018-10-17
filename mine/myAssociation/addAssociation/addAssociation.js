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
    school:"q23",
    author:"社会人",
    phone:"123"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },
  //获取input值
  onChange(e) {
    this.setData({
      [e.detail.name]: e.detail.value
    })
  },

  //提交
  onSubmit() {
    if (this.data.profe == "") {

      app.globalData.toast("请描述所学专业?")

      return
    }
    if (this.data.realname == "") {

      app.globalData.toast("请输入您的姓名?")

      return
    }
    if (this.data.cert_url == "") {

      app.globalData.toast("请上传手持身份证或学生证照片?")

      return
    }
    let data = {
      school_id: this.data.sid,
      profe: this.data.profe,
      educ_job: this.data.educ_job,
      realname: this.data.realname,
      cert_url: this.data.cert_url
    }
    Actions.doPost({
      url: URLs.SCHOOL_SETTING,
      data: data
    }).then(res => {
      app.globalData.toast("申请成功")

      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 500)

    }).catch(error => {

    })

  },

  //上传照片
  changeImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ['album', 'camera'],
      success: function (res) {
        Actions.uploadSign.clubApply(res.tempFilePaths[0])
          .then((uploadRes) => {
            if (uploadRes.errMsg == "uploadFile:ok") {
              that.setData({
                cert_url: uploadRes.pic
              })
            }
          })
          .catch(err => {
            console.log('上传错误：：', err);
          });
      },
    })

  }
})