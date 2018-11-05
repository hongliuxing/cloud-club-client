// pages/clubinfo/clubinfo.js
/**
 * 社团信息统一展现页面
 * 展示内容包含: 
 * 1. 基本信息
 * 2. 历史活动
 * 3. 简单统计
 */
import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
import * as Defaults from "../../utils/default";
import DataListController from "../../utils/comps/DataListController.js";
import SimpleDataController from "../../utils/comps/SimpleDataController.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        club: {},
        dataListController: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 通过社团id, 判定显示内容
        let { club_id, isAttention} = options;
        if (!club_id || isAttention === undefined){
            return;
        }
        this.setData({ 'club.id': club_id, 'club.isAttention': isAttention }); // 设置当前的社团id
        console.log('CLUB ====>', this.data.club);
        // 加载标签页
        this.onLoadTabbar();
        // 加载社团信息
        let that = this;
        this.onLoadClubinfo()
            .then(res => {
                console.log('clubinfo club: ', res);
                if(res.data.info){
                    that.setData({ 
                        club: Object.assign(that.data.club, res.data.info)
                    })
                }
                return Promise.resolve(that.data.club.id);
            })
            .then(that.onLoadOtherActivitys)
            .catch(err => {
                console.log('clubinfo club err: ', err);
            });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    /**
     * 加载标签页
     */
    onLoadTabbar(){
        let that = this;

        let topBtns = [{
            title: "活 动",
            btype: "event",
            value: () => that.toggleTab('activity')
        },
        {
            title: "相 册",
            btype: "event",
            value: () => that.toggleTab('album')
        }
        ];
        that.setData({ 
            topBtns,
            currentPanel: 'activity' 
        });
    },
    /**
     * 加载社团信息
     */
    onLoadClubinfo(){
        let that = this;

        return Actions.doGet({
            url: URLs.CLUB_DETAIL_INFO,
            data: {
                clubid: that.data.club.id
            }
        });
    },
    /**
     * 切换显示面板
     */
    toggleTab(panelId){
        let that = this;

        that.setData({
            currentPanel: panelId
        });

        if( panelId == 'album' && !that.data.albumController ){
            that.onLoadAlbums(false);
        }
    },

    /**
     * 加载相册
     */
    onLoadAlbums(append=true){
        let that = this;

        let albumController = null;
        if (!that.data.albumController){
            // 如果相册的控制器是不存在的, 则新建一个
            albumController = new SimpleDataController();
            that.setData({
                albumController: albumController
            })
        }
        albumController = that.data.albumController;
        
        wx.showLoading({ title: '载入数据...', mask: true });
        // 加载相册数据
        return Actions.doGet({
            url: URLs.ACTIVITY_ALBUM,
            data: {
                club_id: that.data.club.id,
                pagenum: albumController.nextPagenum()
            }
        }).then(res => {
            wx.hideLoading();
            console.log('加载相册数据成功: ', res);
            let newVal = albumController.push(res.data.list.map(o => o.pic_url));
            that.setData({
                'albumController.list': newVal
            });

        }).catch(err => {
            console.log('加载相册数据异常: ', err);
            wx.hideLoading();
            app.globalData.toast("载入数据异常")
        });
    },

    /**
     * 加载更多的其他活动
     */
    onLoadOtherActivitys(club_id) {
        if (!club_id) return;
        let that = this;

        wx.showLoading({ title: '载入数据...', mask: true });
        return Actions.doGet({
            url: URLs.ACTIVITY_CONCERNED_LIST,
            data: { club_id, pagenum: 1 }
        }).then(res => {
            wx.hideLoading();
            console.log('ActivityList => ', res);
            if (res.data.err) {
                return console.log(res.data.err);
            }
            if (res.data.list) {
                if (that.data.dataListController === null) {
                    that.initDataListController();
                }
                // console.log('that.data.dataListController: ', DataListController, that.data.dataListController);
                that.data.dataListController.push(res.data.list)
            }
        }).catch(err => {
            console.log('更多活动加载失败:', err);
            wx.hideLoading();
            app.globalData.toast("载入数据异常")
        });
    },
    /**
     * 初始化数据列表控制器
     */
    initDataListController() {
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
                    console.log('数据填充完成...', arr);
                }// end: push
            })
        });// end: this.setData
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
     * 预览
     */
    onAlbumProview(e){

        var index = e.currentTarget.dataset.index;
        var imgArr = this.data.albumController.list;
        
        // console.log('perview: ', imgArr[index].pic_url);

        wx.previewImage({
            current: imgArr[index],
            urls: imgArr,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    /**
     * 点击切换关注
     */
    onLuvTap() {
        let that = this;
        let { id, isAttention } = that.data.club;
        let url = '';
        if (isAttention == 1) {
            url = URLs.CLUB_ATTENTION_CANCEL;
        } else if (isAttention == 0) {
            url = URLs.CLUB_ATTENTION_ADD;
        }
        // console.log('切换关注:::::', e.detail.item, isAttention);

        // 进行关注行为, 或取消关注行为
        Actions.doPost({
            url: url,
            data: { club_id: id }
        }).then(res => {
            // 返回数据包含 数据库操作数据, 及点赞行为描述
            if (res.data.err) {
                return console.log('关注行为有误', res);
            }
            // 取消关注之后, 前一个页面动态更新考虑一下谢谢
            that.setData({
                'club.isAttention': (isAttention == 1 ? 0 : 1)
            });
            // 刷新上一页的 关注 状态
            that.reflushPrevpage();
        }).catch(err => {
            console.log('关注行为有误2', err);
        });
    },
    /**
     * 刷新上一级页面( 关注状态 )
     */
    reflushPrevpage() {
        //获取页面栈
        var pages = getCurrentPages();
        var prevpage = pages[pages.length - 2];//当前页
        console.log('上一个页面是: ', prevpage);

        if (prevpage.onReflushPage) {
            // console.log('调用上一个页面的刷新...');
            prevpage.onReflushPage();
        }
    },
    /**
     * 转发事件触发
     */
    onShareAppMessage(e) {
        let that = this;
        console.log('转发事件: ', e);
        let { atitle, aid, cname, school, logo } = e.target.dataset;

        console.log({ atitle, aid, cname, school, logo });

        return {
            title: atitle + ' [来自: ' + cname + ' - ' + school + ' ]',
            path: "/pages/activity/info/info?id=" + aid + "&share=true",
            imageUrl: logo
        };
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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