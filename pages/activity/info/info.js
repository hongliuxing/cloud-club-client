// pages/activity/info/info.js
import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
import DataListController from "../../../utils/comps/DataListController.js";


Page({

    /**
     * 页面的初始数据
     */
    data: {
        activity: {},
        otherActivityList: [],
        dataListController: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //   console.log('activity info: ', options);
        if (!options.id) {
            return;
        }
        this.onLoadActivityInfo(options.id)
            .then(this.onLoadOtherActivitys).catch(err => {
                console.log(err);
            });
    },
    /**
     * 加载活动信息
     */
    onLoadActivityInfo(activity_id){
        let that = this;
        return Actions.doGet({
            url: URLs.ACTIVITY_SIMPLE_INFO,
            data: { activity_id }
        }).then(res => {
            console.log('ActivityInfo => ', res);
            if(res.data.err){
                return console.log(res.data.err);
            }
            if(res.data.info){
                that.setData({
                    activity: res.data.info,
                    previewArr: res.data.info.imgs.map(pic => pic.pic_url)
                });
                return res.data.info.club_id;
            }
        }).catch(err => {

        });
    },

    /**
     * 加载更多的其他活动
     */
    onLoadOtherActivitys(club_id) {
        if (!club_id) return;
        let that = this;

        return Actions.doGet({
            url: URLs.ACTIVITY_CONCERNED_LIST,
            data: { club_id, pagenum:1 }
        }).then(res => {
            console.log('ActivityList => ', res);
            if (res.data.err) {
                return console.log(res.data.err);
            }
            if (res.data.list) {
                if (that.data.dataListController === null){
                    that.initDataListController();
                }
                that.data.dataListController.push(res.data.list)
                // that.setData({
                //     otherActivityList: res.data.list,
                //     listBean: {

                //     }
                // });
            }
        }).catch(err => {

        });
    },

    initDataListController(){
        let that = this;
        this.setData({
            dataListController: new DataListController({
                onTap: function (e) {
                    console.log('啊啊啊啊啊啊啊啊啊啊啊啊啊啊', e.detail.item);
                    // 该数据的点击事件处理
                    wx.redirectTo({
                        url: '/pages/activity/info/info?id=' + e.detail.item.id
                    })
                },
                push: function (arr) { // 这里将接口中获取的 数组 加载到标签数据中的list
                    // console.log('push..............',arr);
                    // 如果已经没有数据时,调整more为false
                    if (!Array.isArray(arr) || arr.length === 0) {
                        console.log('没数据了...');
                        this.more = false;
                    } else {
                        this.list = this.list.concat(arr);

                        let key = 'dataListController.list';
                        that.setData({
                            [key]: this.list
                        });
                    }
                }
            })
        });
    },

    /**
     * 预览图片
     */
    onProview(e) {
        // console.log(e.currentTarget.dataset.index);
        // e.stopPropagation();
        var index = e.currentTarget.dataset.index;
        var imgArr = this.data.previewArr;
        // console.log(imgArr);
        wx.previewImage({
            current: imgArr[index],
            urls: imgArr,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})