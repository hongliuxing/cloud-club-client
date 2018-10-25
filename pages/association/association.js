import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
import DataListController from "../../utils/comps/DataListController.js";
//获取应用实例
// const app = getApp()

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
    /**
     * 页面初始化事件
     */
    onLoad: function () {
        let that = this;
        this.checkLogin().then(res => {
            // 首次登录成功
            // wx.hideLoading();
        })
        .then(that.onLoadPanelInfo) // 加载用户面板所需缓存信息
        .then(that.loadMyClub) // 获取标签页中的社团标识
        .catch(err => {
            // 失败
            wx.hideLoading();
            console.log(err);
        });

    },
    /**
     * 若无登录态则尝试登录一次
     */
    checkLogin() {
        if (!this.data.hasLoginer) {
            // 如果没有登录态则登录一次
            wx.showLoading({ title: '在组装社团...', mask: true });
            return Actions.login();
        } else {
            return Promise.resolve();
        }
    },
    /**
     * 加载 Panel 信息
     * 包含: 用户id, 昵称, 头像, 性别, 电话, 真实姓名
     * 学校设置状态, 学校id, 学校名称, 社团数量, 幸运值
     * 是否领取火把, 可用火把数量
     * 
     */
    onLoadPanelInfo(){
        let that = this;

        Actions.doGet({
            url: URLs.USER_PANEL_INFO,
            data: {}
        }).then(res => {
            // wx.hideLoading()
            // let status = res.data.info.school_struts;
            // let name = "";
            // if (status == 1) {
            //     name = "已通过"
            // } else if (status == 0) {
            //     name = "申请中"
            // } else if (status == -1) {
            //     name = "未通过"
            // } else {
            //     name = "未设置"
            // }

            // that.setData({
            //     info: res.data.info,
            //     school: name,
            //     status: status
            // })

            wx.setStorageSync("userInfo", res.data.info)
        }).catch(err => {
            console.log('加载 Panel 信息 err: ', err);
        });
    },
    /**
     * 社团的下拉在切换数据时
     */
    onClubChange(e, index, range) {
        let that = this;
        wx.pageScrollTo({
            scrollTop: 0
        })
        console.log('【range[index] ： 】', index, range[index]);
        let club_id = range[index].id;
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
    onActivityTiming(e, index, range) {
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
    loadMyClub() {
        let that = this;
        // 返回的是请求的Promise
        return Promise.resolve().then(res => {
            // console.log('我的社团 res: ', res);
            // 我的社团数据
            let public_range = [{
                title: '全部社团',// 社团名称
                id: 'all'
            }, {
                    title: '我的学校',// 我的学校
                id: 'school'
            }, {
                    title: '我关注的',// 我关注的
                id: 'heart'
            }];
            
            // 将社团数组生成标签页按钮所需的数据
            // let clubs_range = clubs.map((club, index) => {
            //     return {
            //         title: club.title,// 社团名称
            //         ind: index,
            //         activityId: club.id
            //     };
            // });
            let topBtns = [
                {
                    title: "我的社团", btype: "list", value: {
                        range: public_range,
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
            for (let club of public_range) {

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
                    push: function (arr, append = true) { // 这里将接口中获取的 数组 加载到标签数据中的list
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
                            if (append) {
                                // 将数据追加在末尾
                                this.list = this.list.concat(this.addDateLabel(arr));
                            } else {
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
        })
        // .catch(err => {
        //     console.log('我的社团 err: ', err);
        // });
    },
    /**
     * 获取当前的 TabData 
     */
    getCurrentTabData() {
        let tabId = this.data.currentTabId;
        // return this.data.tabController.get(tabId);
        return this.data.tabController[this.data.tabMapper.get(tabId)];
    },

    /**
     * 刷新页面数据
     */
    onReflushPage(){
        console.log('association 页面刷新...');
        let that = this;
        let currentTab = that.getCurrentTabData(); // 获取当前 标签页数据对象
        currentTab.pagenum = 0;
        currentTab.list = [];
        that.loadActivityList();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.onReflushPage()
    },

    /**
     * 加载活动列表
     * 该方法只针对于当前激活状态的tabid进行数据加载
     */
    loadActivityList(append = true) {
        let that = this;
        let currentTab = that.getCurrentTabData(); // 获取当前 标签页数据对象
        let currentTiming = that.data.currentTiming; // 获取当前的活动时机
        console.log('currentTabcurrentTab: ', currentTab);
        // 如果是全部标签, 则将社团id置空, 因为服务器对于想要获取所有的认证时,id需要是空字符串
        let club_id = currentTab.data.id; // 这里不存在 社团id, 只存在 all 和 heart 和 school 三个可选项
        if ('all' !== club_id && 'heart' !== club_id && 'school' !== club_id){
            return;
        }
        let url = '';
        if ('all' === club_id){
            url = URLs.ACTIVITY_PUBLIC_LIST;
        } else if ('heart' === club_id) {
            url = URLs.ACTIVITY_ATTENTION_LIST;
        } else if ('school' === club_id) {
            url = URLs.ACTIVITY_SCHOOL_LIST;
        }
        // 判断填充还是追加数据
        if (!append) {
            currentTab.pagenum = 1;
        }
        let pagenum = append ? currentTab.nextPagenum() : currentTab.pagenum;

        // 加载框
        wx.showLoading({
            title: '运送社团活动...', mask: true
        })

        // 返回活动查询结果
        return Actions.doGet({
            url: url,
            data: { pagenum, timing: currentTiming }
        }).then(res => {
            wx.hideLoading();
            if (res && !res.data.err && res.data.list) {
                console.log('社团活动列表:', res);
                // 考虑如何分标签及保存的数据
                currentTab.push(res.data.list, append);
            }
            wx.hideLoading();
        }).catch(err => {
            wx.hideLoading();
            console.log('社团活动列表 err: ', err);
        });
    },
    /**
     * 当上拉触底时, 加载当前页面的更多数据
     */
    onReachBottom() {
        let that = this;
        let currentTab = that.getCurrentTabData();
        if (currentTab.more) {
            that.loadActivityList();
        }
    },
    
    /**
     * 转发事件触发
     */
    onShareAppMessage(e) {
        let that = this;
        console.log('转发事件: ', e);
        let { atitle, aid, cname, school, logo} = e.target.dataset;

        console.log({ atitle, aid, cname, school, logo });

        return {
            title: atitle + ' [来自: '+cname+' - '+school+' ]',
            path: "/pages/activity/info/info?id=" + aid + "&share=true",
            imageUrl: logo
        };
    }
    // end
})