import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let app = getApp();
let that;
let x = 0;
let testPhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
let times;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeText: "发送短信验证码",
    smsToken: "",
    code: "",
    telephone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    if (options.phone){
      this.setData({
        telephone: options.phone
      })
    }
  },
  //手机号
  onCallPhone(e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  //发送验证码
  onPhone() {
    x++;
    if (!this.data.isTime && x === 1) {
      if (testPhone.test(this.data.telephone)) {
        let time = 60;
        times = setInterval(function() {
          if (time <= 1) {
            that.setData({
              codeText: "再次获取",
              disabled: false
            })
            x = 0;
            clearInterval(times)
          } else {
            time--
            that.setData({
              codeText: time,
              disabled: true
            })
          }

        }, 1000)

        Actions.doPost({
          url: URLs.USER_PHONE_SMS,
          data: {
            telephone: that.data.telephone
          }
        }).then(res => {
          that.setData({
            smsToken: res.data.info
          })
        }).catch(error => {

        })

      } else {
        app.globalData.toast("请输入正确手机号")
        x = 0;
        return
      }
    }
  },
  //获取验证码
  onCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //提交
  onSubmit() {
    if (!testPhone.test(this.data.telephone)) {
      app.globalData.toast("请输入正确手机号")
      return
    }
    if(this.data.code==""){
      app.globalData.toast("请输入验证码")
      return
    } 
    let data = {
      telephone: this.data.telephone,
      code: this.data.code,
      smsToken: this.data.smsToken
    }
    Actions.doPost({
      url: URLs.USER_PHONE_SAVE,
      data: data
    }).then(res => {
      
      app.globalData.goBack({})
     
      wx.setStorageSync("phone", that.data.telephone)
    }).catch(error => {

    })
  }

})