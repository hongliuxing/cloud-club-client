// mine/person/editPhone/editPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeText: "发送短信验证码",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //手机号
  onCallPhone(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  async onPhone() {
    x++;
    if (!this.data.isTime && x === 1) {
      if (testPhone.test(this.data.phoneNum)) {
        let time = 60;
        times = setInterval(function () {
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
        let data = await sendSMS({
          phoneNum: this.data.phoneNum
        })
        console.log(data.data, "data.data")
        if (data.err.errCode === 0) {
          this.setData({
            smscode: data.data.smscode
          })
        }
      } else {
        app.globalData.toast({
          title: "请输入正确手机号",
          icon: "none"
        })
        x = 0;
        return
      }
    }
  },
  onCode(e) {
    this.setData({
      verifyCode: e.detail.value
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})