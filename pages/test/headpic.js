// pages/test/headpic.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // headpic: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erz7lQ4M8kzYPX5MnP1jRyotyF3lVg4Qibw5kN3uh3WTITPyGh5ZzY8U1ia5v3psCX0vVxiaSgyzYrlg/132"
    },

    getUser(e) {
        console.log('获取微信信息：：', e);
        this.setData({
            headpic: e.detail.userInfo.avatarUrl
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})