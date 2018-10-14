import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
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
        tabController: null
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
    onTabbarClick(club_id){
        // 滚动条置顶
        wx.pageScrollTo({
            scrollTop: 0
        })
        // 如果点击的标签页 等于 当前激活的标签页, 则没有其他动作
        if (club_id === this.data.currentTabId){
            return;
        }
        let that = this;
        console.log('点击的标签页id是:', club_id);
        // tab切换后, 设置当前页面的 tabId
        that.setData({
            currentTabId: club_id
        });
        // 获取当前页面的 tabData 数据, 如果数据无内容,则尝试请求一次活动列表, 有则略过
        let currentTab = that.getCurrentTabData();
        if (Array.isArray(currentTab.list) && currentTab.list.length === 0){
            // 当前标签页数据为空时,尝试调用一次 活动列表加载
            that.loadActivityList();
        }else{
            // 显示当前标签页数据所示的list
            that.setData({
                newsListData: currentTab.list
            });
        }
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
            let topBtns = clubs.map(club => {
                return {
                    title: club.title,// 社团名称
                    btype: "event",
                    // 这里统一绑定了一个点击之后的处理函数,并传递当前对象的id过去
                    value: () => that.onTabbarClick(club.id)
                };
            });
            // 渲染顶部标签页
            that.setData({
                topBtns: topBtns
            });
            // 添加标签控制器的初始数据
            let tc = new Map();
            for(let club of clubs) {
                // 这里通过 社团id 作为标签页的key
                // 所指向的值,是一个标签页控制的对象(这个对象很有意思)
                tc.set(club.id, {
                    data: {
                        id: club.id // 记录了标签页id
                    },
                    list: [], // 当前标签页的list数据
                    more: true, // 是否有更多数据(处理下拉刷新时一直跳的bug)
                    pagenum: 0, // 默认初始页面是0, 但实际上页面是从1开始的,因此每次都调用nextPagenum方法
                    nextPagenum: function(){ // 要加载的下一个数据时的页码
                        this.pagenum++;
                        return this.pagenum;
                    },
                    push: function(arr){ // 这里将接口中获取的 数组 加载到标签数据中的list
                        this.list = this.list.concat(arr);
                        // console.log('push list: ', this.list);
                        // console.log('push arr: ', arr);
                        // 如果已经没有数据时,调整more为false
                        if(!Array.isArray(arr) || arr.length === 0 ){
                            this.more = false;
                        }
                        that.setData({ // 设置newsListData,填充list组件
                            newsListData: this.list
                        });
                        //console.log('that.data.newsListData : ', that.data.newsListData);
                    }
                });
            }
            // 第一次初始化tabController
            that.setData({
                tabController: tc
            });
            // 设置 "全部社团" 为当前的页面的默认标签id
            that.setData({
                currentTabId: 'all'
            });
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
        return this.data.tabController.get(tabId);
    },
    /**
     * 加载活动列表
     * 该方法只针对于当前激活状态的tabid进行数据加载
     */
    loadActivityList() {
        let that = this;
        let currentTab = that.getCurrentTabData(); // 获取当前 标签页数据对象
        // 如果是全部标签, 则将社团id置空, 因为服务器对于想要获取所有的认证时,id需要是空字符串
        let club_id = currentTab.data.id === 'all' ? '' : currentTab.data.id;
        let pagenum = currentTab.nextPagenum();

        // 返回活动查询结果
        return Actions.doGet({
            url: URLs.ACTIVITY_CONCERNED_LIST,
            data: { club_id, pagenum }
        }).then(res => {
            if(res && !res.data.err && res.data.list){
                console.log('社团活动列表:', res);
                // 考虑如何分标签及保存的数据
                currentTab.push(res.data.list);
            }
        }).catch(err => {
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