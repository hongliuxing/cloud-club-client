// pages/test/uploadtest.js
import uploadFile from '../../utils/upload/ali-oss.js';
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
          { title: "上传1", btype: "event", value: (e) => { console.log('this is 频道1 event !!!'); } },
          { title: "上传2", btype: "event", value: this.testUpload  }
      ];
      this.setData({
          topBtns: topBtns
      });
  },

  testUpload(e){
      console.log('准备上传图片...');
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                console.log('选择成功： ', res.tempFiles)
                console.log('开始上传...');
                uploadFile(res.tempFiles[0].path, 'img/', (aliyunFileKey) => {
                    console.log('aliyunFileKey：：', aliyunFileKey);
                }, (err) => {
                    console.log('上传错误...');
                });
            },
            fail: function(res) {},
            complete: function(res) {},
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