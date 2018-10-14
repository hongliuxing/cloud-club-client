let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBtns:[],
    image:true,
    case:true,
    height:140,
    table:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // 标签页频道组件
    let topBtns = [
      { title: "申请中", btype: "event", value: (e) => this.applying(e) },
      { title: "申请历史", btype: "event", value:(e)=> this.applyHistory(e) }
    ];
    this.setData({
      topBtns: topBtns
    });
  },

  //申请中
  applying(e){
    if (this.data.table===1){
         return
    }else{
       that.setData({
         table:1
       })
    }
  },
  applyHistory(e) {
    if (this.data.table === 2) {
      return
    } else {
      that.setData({
        table: 2
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