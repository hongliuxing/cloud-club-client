// pages/welcome/welcome.js
import * as Actions from '../../utils/net/Actions.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canBegin: false
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
     * 监听授权状态
     */
    userAuthorize(e){
        const that = this;
        wx.getSetting({
            success: res => {
                console.log('权限设置成功: ', e);
                if (res.authSetting['scope.userInfo']) {
                    wx.setStorageSync("headerInfo", { avatar_url: e.detail.userInfo.avatarUrl, nickname: e.detail.userInfo.nickName})  
                    Actions.login();
                    // 鉴权成功
                    that.setData({ canBegin: true });
                }
            }
        });
    },
    /**
     * 进入主页
     */
    goIndex(){
        wx.switchTab({
            url: '/pages/association/association'
        })
    }
})