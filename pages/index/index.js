import * as Actions from "../../utils/net/Actions.js";
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasLoginer: wx.getStorageSync("loginer")
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    bti(e) {
        console.log('bti: ', e);
    },
    mySetting(e) {
        console.log('mySetting: ', e);
    },
    onLoad: function() {
        if (!this.data.hasLoginer){
            // 如果没有登录态则登录一次
            wx.showLoading({
                title: '正在组装社团...',
                mask: true
            })
            // 登录
            Actions.login().then(res => {
                wx.hideLoading();
            }).catch(err => {
                wx.showToast({
                    title: err,
                    icon: 'none',
                    duration: 1500,
                    mask: true
                })
            });
        }

        // 标签页频道组件
        let topBtns = [{
                title: "全部社团",
                btype: "event",
                value: (e) => {
                    console.log('this is 频道1 event !!!');
                }
            },
            {
                title: "频道2",
                btype: "event",
                value: (e) => {
                    console.log('this is 频道2 event !!!');
                }
            },
            {
                title: "频道3",
                btype: "event",
                value: (e) => {
                    console.log('this is 频道3 event !!!');
                }
            }
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
    loadActivityList(clubId) {
        // 调用加载活动的接口

    }

})