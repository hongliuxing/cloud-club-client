//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }// end: if-else
    let topBtns = [
        { title: "频道1", btype: "event", value: () => { console.log('this is 频道2 event !!!'); }},
        { title: "频道2", btype: "event", value: () => { console.log('this is 频道2 event !!!'); } },
        { title: "频道3", btype: "list", value: {
            range: [{ ind: 0, title: '陕师大' }, { ind: 1, title: '西法大' }, { ind: 2, title: '外国语大学' }],
            rangeKey: 'title',
            index: 1,
            bindchange: (e) => {
                console.log("触发了下拉....");
            }
        } }
    ];
    this.setData({
        topBtns: topBtns
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
