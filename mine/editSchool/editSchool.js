let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    imageUrl:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     that = this;
  },
  //获取input值
  onChange(e){
    this.setData({
      [e.detail.name]:e.detail.value
    })
  },
  //选择城市
  selectCity(){

  },
  //选择学校
  selectSchool() {

  },
  //选择学历或职务
  selectDuty() {

  },
  //提交
  onSubmit(){

  },
  changeImage(){
    wx.chooseImage({
      success: function(res) {
        let url = res.tempFilePaths[0]
         that.setData({
           imageUrl:url
         })
      },
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