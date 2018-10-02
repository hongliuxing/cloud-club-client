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

    // 标签页频道组件
    let topBtns = [
        { title: "频道1", btype: "event", value: (e) => { console.log('this is 频道1 event !!!');       }},
        { title: "频道2", btype: "event", value: (e) => { console.log('this is 频道2 event !!!');       } },
        { title: "频道3", btype: "event", value: (e) => { console.log('this is 频道3 event !!!');       } }
    ];
    this.setData({
        topBtns: topBtns
    });
    // 获取活动数据,并载入新闻列表组件

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 加载活动列表,通过社团id,null为所有社团
   */
  loadActivityList(clubId){
      // 调用加载活动的接口
      
  }

})
