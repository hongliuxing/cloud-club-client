// pages/association/association.js
import { uploadSign } from '../../utils/net/Actions.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    upup() {
        // 选择图片先
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                console.log('选择图片成功： ', res.tempFiles)
                /**
                 * upload/support.js提供的上传封装
                 * 参数有两个：
                 * filepath: 微信选择的上传图片地址
                 * singAPI: 用于获取上传签名的函数（这个函数请自行编写）
                 */
                uploadSign.pid(res.tempFiles[0].path)
                    .then((uploadRes) => {
                        console.log('上传结果：：：', uploadRes);
                    })
                    .catch(err => {
                        console.log('上传错误：：', err);
                    });
            },
            fail: function(res) {},
            complete: function(res) {},
        })
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