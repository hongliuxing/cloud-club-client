// mine/myAssociation/joinGroup/joinGroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 标签页频道组件
    let topBtns = [
      { title: "本校社团列表", btype: "event", value: (e) => this.Associations() },
      { title: "申请历史", btype: "event", value: (e) => this.applyHistory()}
    ];
    this.setData({
      topBtns: topBtns
    });
  },

  //本校社团
  Associations(){
     console.log("shetuanlibiao")
  },

  //申请历史
  applyHistory(){
    console.log("applyHistory")
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