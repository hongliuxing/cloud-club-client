import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
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
    /**
     * 若无登录态则尝试登录一次
     */
    checkLogin() {
        if (!this.data.hasLoginer) {
            // 如果没有登录态则登录一次
            wx.showLoading({ title: '正在组装社团...', mask: true });
            return Actions.login();
        }else{
            return Promise.resolve();
        }
    },
    onTabbarClick(club_id){
        console.log('点击的标签页id是:', club_id);
    },
    loadMyClub(){
        let that = this;
        return Actions.doGet({
            url: URLs.CLUB_SIMPLE_LIST,
            data: {}
        }).then(res => {
            console.log('我的社团 res: ', res);
            let clubs = res.data.list? res.data.list: [];
            let topBtns = clubs.map(club => {
                return {
                    title: club.title,
                    btype: "event",
                    value: () => that.onTabbarClick(club.id)
                };
            });
            that.setData({
                topBtns: topBtns
            });
        }).catch(err => {
            console.log('我的社团 err: ', err);
        });
    },
    onLoad: function() {
        this.checkLogin().then(res => {
            // 首次登录成功
            wx.hideLoading();
        })
        .then(this.loadMyClub)
        .catch(err => {
            // 失败
            console.log(err);
        });

        // 标签页频道组件
        // let topBtns = [{
        //         title: "全部社团",
        //         btype: "event",
        //         value: (e) => {
        //             console.log('this is 频道1 event !!!');
        //         }
        //     },
        //     {
        //         title: "频道2",
        //         btype: "event",
        //         value: (e) => {
        //             console.log('this is 频道2 event !!!');
        //         }
        //     },
        //     {
        //         title: "频道3",
        //         btype: "event",
        //         value: (e) => {
        //             console.log('this is 频道3 event !!!');
        //         }
        //     }
        // ];
        // this.setData({
        //     topBtns: topBtns
        // });
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