import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
import DataListController from "../../utils/comps/DataListController.js";
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasLoginer: wx.getStorageSync("loginer"),
        // 用于渲染当前界面列表数据的数组
        newsListData: [],
        // 标签数据控制器
        currentTabId: null,
        tabController: null,
        tabHeight: 0,
        // 当前的活动时机
        currentTiming: 0
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
    // 用于处理标签页的点击
    // onTabbarClick(club_id){
    //     // 滚动条置顶
    //     // wx.pageScrollTo({
    //     //     scrollTop: 0
    //     // })
    //     // 如果点击的标签页 等于 当前激活的标签页, 则没有其他动作
    //     if (club_id === this.data.currentTabId){
    //         return;
    //     }
    //     let that = this;
        
    //     console.log('点击的标签页id是:', club_id);
    //     // tab切换后, 设置当前页面的 tabId
    //     // 激活新的标签页
    //     that.setData({
    //         currentTabId: club_id
    //     });
    //     // 获取当前页面的 tabData 数据, 如果数据无内容,则尝试请求一次活动列表, 有则略过
    //     let currentTab = that.getCurrentTabData();
    //     if (Array.isArray(currentTab.list) && currentTab.list.length === 0){
    //         // 当前标签页数据为空时,尝试调用一次 活动列表加载
    //         that.loadActivityList();
    //     }else{
    //         // 显示当前标签页数据所示的list
    //         that.setData({
    //             newsListData: currentTab.list
    //         });
    //     }
    //     // wx.hideLoading();
    // },
    /**
     * 社团的下拉在切换数据时
     */
    onClubChange(e, index, range){
        let that = this;
        wx.pageScrollTo({
            scrollTop: 0
        })
        // console.log(index, range[index].activityId);
        let club_id = range[index].activityId;
        // 激活新的标签页
        that.setData({
            currentTabId: club_id
        });
        // 获取当前页面的 tabData 数据, 如果数据无内容,则尝试请求一次活动列表, 有则略过
        let currentTab = that.getCurrentTabData();
        // if (Array.isArray(currentTab.list) && currentTab.list.length === 0) {
            // 当前标签页数据为空时,尝试调用一次 活动列表加载
        that.loadActivityList(false);
        // } else {
        //     // 显示当前标签页数据所示的list
        //     that.setData({
        //         newsListData: currentTab.list
        //     });
        // }
    },
    /**
     * 活动时机下拉
     */
    onActivityTiming(e, index, range){
        let that = this;
        wx.pageScrollTo({
            scrollTop: 0
        })
        let timing = index;
        that.setData({
            currentTiming: timing
        });
        // 当前标签页数据为空时,尝试调用一次 活动列表加载
        that.loadActivityList(false);
    },
    /**
     * 加载社团,并填充标签页按钮
     * 这玩意儿登录进来只加载一次哦
     */
    loadMyClub(){
        let that = this;
        // 返回的是请求的Promise
        return Actions.doGet({
            url: URLs.CLUB_SIMPLE_LIST,
            data: {}
        }).then(res => {
            console.log('我的社团 res: ', res);
            // 我的社团数据
            let clubs = res.data.list? res.data.list: [];
            clubs.unshift({
                title: '全部社团',// 社团名称
                id: 'all'
            });
            // 将社团数组生成标签页按钮所需的数据
            let clubs_range = clubs.map((club, index) => {
                return {
                    title: club.title,// 社团名称
                    ind: index,
                    activityId: club.id
                };
            });
            let topBtns = [
                {
                    title: "我的社团", btype: "list", value: {
                        range: clubs_range,
                        rangeKey: 'title',
                        index: 0,
                        bindchange: that.onClubChange
                    }
                }, {
                    title: "活动时间", btype: "list", value: {
                        range: [{ ind: 0, title: '所有活动' }, { ind: 1, title: '即将开始' }, { ind: 2, title: '进行中的' }, { ind: 3, title: '已结束' }, { ind: 4, title: '活动总结' }],
                        rangeKey: 'title',
                        index: 0,
                        bindchange: that.onActivityTiming
                    }
                },
            ];
            // 渲染顶部标签页
            that.setData({
                topBtns: topBtns
            });
            // 设置 ListPanel 的最小高度
            let { windowHeight, windowWidth } = wx.getSystemInfoSync();
            // px = rpx / 750 * windowWidth
            that.setData({
                tabHeight: windowHeight - (110 / 750 * windowWidth)
            });
            // 添加标签控制器的初始数据
            // let tc = new Map();
            let tc = [];

            let tabMapper = new Map();
            let tc_index = 0;
            // let now = new Date(); // 今天
            for(let club of clubs) {

                // 这里通过 社团id 作为标签页的key
                // 所指向的值,是一个标签页控制的对象(这个对象很有意思)
                tc.push(new DataListController({
                    data: {
                        id: club.id // 记录了标签页id
                    },
                    tabIndex: tc_index,
                    onTap: function (e) {
                        // console.log('啊啊啊啊啊啊啊啊啊啊啊啊啊啊', e.detail.item);
                        // 该数据的点击事件处理
                        wx.navigateTo({
                            url: '/pages/activity/info/info?id=' + e.detail.item.id
                        })
                    },
                    push: function (arr, append=true) { // 这里将接口中获取的 数组 加载到标签数据中的list
                        // 如果已经没有数据时,调整more为false
                        if (!Array.isArray(arr) || arr.length === 0) {
                            console.log('没数据了...');
                            this.isQueryed = true; // 已经查询过一次了再判断是否显示空图片
                            let queryKey = 'tabController[' + this.tabIndex + '].isQueryed';
                            that.setData({
                                [queryKey]: this.isQueryed
                            });

                            this.more = false;
                            let moreKey = 'tabController[' + this.tabIndex + '].more';
                            that.setData({
                                [moreKey]: this.more
                            });

                            if (!append) {
                                let listKey = 'tabController[' + this.tabIndex + '].list';
                                this.list = [];
                                that.setData({
                                    [listKey]: this.list
                                });
                            }
                        } else {
                            if (append){
                                // 将数据追加在末尾
                                this.list = this.list.concat(this.addDateLabel(arr));
                            }else{
                                // 完全替换数组中的新闻数据
                                this.list = this.addDateLabel(arr)
                            }
                            this.isQueryed = true; // 已经查询过一次了再判断是否显示空图片

                            let queryKey = 'tabController[' + this.tabIndex + '].isQueryed';
                            let listKey = 'tabController[' + this.tabIndex + '].list';
                            that.setData({
                                [listKey]: this.list,
                                [queryKey]: this.isQueryed
                            });
                        }
                    }// func: push
                }));// new DataListController

                tabMapper.set(club.id, tc_index++);
            } // for(let club of clubs)
            console.log('【TC】: :: ', tc);
            // 设置 "全部社团" 为当前的页面的默认标签id
            that.setData({
                currentTabId: 'all'
            });
            // 设置 "全部社团" 为当前激活的 标签指定的Panel
            // tc.get('all').active = true;
            // 第一次初始化tabController
            that.setData({
                tabController: tc,
                tabMapper: tabMapper
            });
            // console.log('panels: ', Array.from(tc.values()));
            
            // 手动加载第一次的"全部社团"中的数据
            that.loadActivityList();
        }).catch(err => {
            console.log('我的社团 err: ', err);
        });
    },
    /**
     * 获取当前的 TabData 
     */
    getCurrentTabData(){
        let tabId = this.data.currentTabId;
        // return this.data.tabController.get(tabId);
        return this.data.tabController[ this.data.tabMapper.get(tabId) ];
    },
    /**
     * 加载活动列表
     * 该方法只针对于当前激活状态的tabid进行数据加载
     */
    loadActivityList(append=true) {
        let that = this;
        let currentTab = that.getCurrentTabData(); // 获取当前 标签页数据对象
        let currentTiming = that.data.currentTiming; // 获取当前的活动时机
        console.log('currentTabcurrentTab: ', currentTab);
        // 如果是全部标签, 则将社团id置空, 因为服务器对于想要获取所有的认证时,id需要是空字符串
        let club_id = currentTab.data.id === 'all' ? '' : currentTab.data.id;
        if(!append){
            currentTab.pagenum = 1;
        }
        let pagenum = append ? currentTab.nextPagenum() : currentTab.pagenum;
        // console.log('[[pagenum]] : ', pagenum);
        // console.log('[[append]] : ', append);

        // 加载框
        wx.showLoading({
            title: '正在运送社团活动...', mask: true
        })

        // 返回活动查询结果
        return Actions.doGet({
            url: URLs.ACTIVITY_CONCERNED_LIST,
            data: { club_id, pagenum, timing: currentTiming }
        }).then(res => {
            wx.hideLoading();
            if(res && !res.data.err && res.data.list){
                console.log('社团活动列表:', res);
                // 考虑如何分标签及保存的数据
                currentTab.push(res.data.list, append);
            }
        }).catch(err => {
            wx.hideLoading();
            console.log('社团活动列表 err: ', err);
        });
    },
    /**
     * 当上拉触底时, 加载当前页面的更多数据
     */
    onReachBottom(){
        let that = this;
        let currentTab = that.getCurrentTabData();
        if (currentTab.more){
            that.loadActivityList();
        }
    },
    /**
     * 页面初始化事件
     */
    onLoad: function() {
        let that = this;
        this.checkLogin().then(res => {
            // 首次登录成功
            wx.hideLoading();
        })
        .then(that.loadMyClub) // 获取标签页中的社团标识
        .catch(err => {
            // 失败
            console.log(err);
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