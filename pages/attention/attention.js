// pages/attention/attention.js
import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
import * as Defaults from "../../utils/default";
import SimpleDataController from "../../utils/comps/SimpleDataController";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaults: {
            avatar: Defaults.DEF_AVATAT,
            nickname: Defaults.DEF_NIKENAME
        },
        listType: '' // 主要用于鉴别当前应刷新哪个列表, 可选项为: attent , recommend
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        let topBtns = [{
                title: "关 注",
                btype: "event",
                value: () => that.onToggleTab('attent')
            },
            {
                title: "推 荐",
                btype: "event",
                value: () => that.onToggleTab('recommend')
            }
        ];
        // 渲染顶部标签页
        // 及推荐 / 关注列表
        let attent = new SimpleDataController();
        let recommend = new SimpleDataController();

        that.setData({
            topBtns: topBtns,
            datalist: [],
            attent, recommend
        });
        // 首次加载 : 关注
        that.onLoadAttentions();

    },
    /**
     * 切换标签
     */
    onToggleTab(tabName){
        let that = this;
        // 滚动条置顶
        wx.pageScrollTo({
            scrollTop: 0
        })
        console.log('切换标签页: ', tabName);
        that.setData({ listType: tabName });
        let controller = tabName === 'attent' ? that.data.attent : that.data.recommend;
        // 没有数据则尝试加载
        if (tabName === 'attent') return that.onLoadAttentions(true);
        if (tabName === 'recommend') return that.onLoadRecommends(true);

    },

    /**
     * 加载我关注的社团
     */
    onLoadAttentions(reload=false) {
        let that = this;
        let controller = that.data.attent;
        that.setData({ listType: 'attent' });

        // 如果是重新加载
        if(reload){
            controller.pagenum = 0;
            controller.list = [];
        }

        // 获取关注的社团列表
        Actions.doGet({
            url: URLs.CLUB_ATTENTION_LIST,
            data: { pagenum: controller.nextPagenum() }
        }).then(res => {
            console.log('关注列表: ', res);
            if(res.data.err || !Array.isArray(res.data.list)){
                return;
            }
            that.setData({
                datalist: controller.push(res.data.list)
            });
        }).catch(err => {
            console.log('关注列表错误: ', err);
        });
    },

    /**
     * 加载我推荐的社团
     */
    onLoadRecommends() {
        let that = this;
        let controller = that.data.recommend;
        that.setData({ listType: 'recommend' }); //CLUB_RECOMMEND_LIST

        // 获取关注的社团列表
        Actions.doGet({
            url: URLs.CLUB_RECOMMEND_LIST,
            data: { pagenum: controller.nextPagenum() }
        }).then(res => {
            console.log('推荐列表: ', res);
            if (res.data.err || !Array.isArray(res.data.list)) {
                return;
            }
            that.setData({
                datalist: controller.push(res.data.list)
            });
        }).catch(err => {
            console.log('推荐列表错误: ', err);
        });
    },

    /**
     * 关注社团
     */
    doAttent(e){
        let that = this;
        // console.log('社团ID: ', e.target.dataset);
        let { cid } = e.target.dataset;

        // 进行关注行为, 或取消关注行为
        Actions.doPost({
            url: URLs.CLUB_ATTENTION_ADD,
            data: {
                club_id: cid
            }
        }).then(res => {
            // 返回数据包含 数据库操作数据, 及点赞行为描述
            that.reranderList(cid, 1);
        }).catch( err => {
            console.log('进行关注时异常: ', err);
        });
    },

    /**
     * 取消关注社团
     */
    cancelAttent(e){
        let that = this;
        // console.log('社团ID: ', e.target.dataset);
        let { cid } = e.target.dataset;

        // 进行关注行为, 或取消关注行为
        Actions.doPost({
            url: URLs.CLUB_ATTENTION_CANCEL,
            data: {
                club_id: cid
            }
        }).then(res => {
            // 返回数据包含 数据库操作数据, 及点赞行为描述
            that.reranderList(cid, 0);
        }).catch(err => {
            console.log('进行关注时异常: ', err);
        });
    },

    /**
     * 重新渲染列表
     * 改变社团的关注状态
     */
    reranderList(club_id, newAttention){
        let that = this;
        let controller = that.getCurrentController();
        controller.list.forEach(item => {
            if (item.club_id === club_id) {
                item.isAttention = newAttention;
            }
        })

        that.setData({
            datalist: controller.list
        });
    },

    /**
     * 获取当前的控制器
     */
    getCurrentController(){
        let that = this;
        if (that.data.listType === 'attent'){
            return that.data.attent
        } else if (that.data.listType === 'recommend'){
            return that.data.recommend
        }
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
        let that = this;
        let { listType } = that.data;
        if (listType === 'attent'){
            that.onLoadAttentions();
        } else if (listType === 'recommend') {
            that.onLoadRecommends();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})