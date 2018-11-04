/**
 * 引导页面, 负责初次进入时的跳转
 * 跳转前验证用户权限( scope.userInfo )
 * - 无权限, 则跳转欢迎页
 * - 有权限, 则跳转index首页
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasLoginer: wx.getStorageSync("loginer"),
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // wx.showLoading({
        //     title: '正在搬运物资...',
        //     mask: true
        // })
        setTimeout(this.onRouter, 800)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        // wx.switchTab(Object object)
        // if (this.data.hasLoginer){
        //     // 如果缓存中存在用户的登录态, 直接跳转至首页
        //     console.log('Guide:: ', '如果缓存中存在用户的登录态, 直接跳转至首页!! ', this.data.hasLoginer);
        //     wx.switchTab({ url: '/pages/association/association' });
        // }
        // else 
        
    }, // onReady
    onRouter(){
        if (this.data.canIUse && wx.getSetting) {
            // 如果缓存中不存在登录态, 则鉴权
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 有权限
                        console.log('Guide:: ', '如果缓存中不存在登录态, 则鉴权: 有权限 ');
                        wx.switchTab({ url: '/pages/association/association' });
                    } else {
                        // 无权限
                        console.log('Guide:: ', '如果缓存中不存在登录态, 则鉴权: 无权限 ');
                        wx.redirectTo({ url: '/pages/welcome/welcome' });
                    }
                }
            }); // end: wx.getSetting >= 1.2.0
        } // end: if (this.data.canIUse)

        // 有0.11%的用户的版本不支持open-type或wx.getSetting
        // 版本 < 1.6.8 的用户只能说 bye bye 了
        else {
            wx.redirectTo({ url: '/pages/welcome/welcome' });
        }
    }
})