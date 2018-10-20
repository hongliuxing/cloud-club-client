import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
import SimpleDataController from "../../../utils/comps/SimpleDataController";
import * as Defaults from "../../../utils/default";

// let sdc = new SimpleDataController();
/**
 * 统一活动评论界面
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        clubLogo: '',
        // dataController: new SimpleDataController()
        defaults: {
            avatar: Defaults.DEF_AVATAT,
            nickname: Defaults.DEF_NIKENAME
        },
        defaultComment: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(Event);
        let { title, id, comment_count, logo_url } = options;
        if (!title || !id || !comment_count || !logo_url) {
            return wx.showToast({
                title: '评论加载异常...',
                duration: 0,
                mask: true
            });
        }
        // 
        let that = this;

        let sdc = new SimpleDataController();
        // 加载社团logo及活动标题
        that.setData({
            clubLogo: logo_url,
            atitle: title,
            activityId: id,
            dataController: sdc,
            datalist: sdc.list
        });
        // 加载活动评论
        that.loadComments();
    },
    /**
     * 加载评论
     */
    loadComments(){
        let that = this;
        let { activityId, dataController } = that.data;
        // console.log('that.data.dataController: ', that.data.dataController, that.data.dataController.nextPagenum);

        return Actions.doGet({
            url: URLs.ACTIVITY_COMMENTS_LIST,
            data: {
                activity_id: activityId,
                pagenum: dataController.nextPagenum()
            }
        }).then(res => {
            console.log('评论列表: ', res);
            let newVal = dataController.push(res.data.list);
            that.setData({
                datalist: newVal
            });
            
        }).catch(err => {
            console.log('评论异常: ', err);
        });
    },
    /**
     * 提交评论
     */
    submitComment(e){
        let that = this;
        // console.log('提交内容: ', e);
        let val = e.detail.value;
        if(typeof val === 'object'){
            val = val.comm;
        }
        val = val.replace(/^\s+|\s+$/gm, '')
        if(val === ''){
            return wx.showToast({
                title: '内容不能是空的',
                duration: 2000,
                image: '/images/page/face-fail.png',
                mask: true
            })
        }
        if (val.length < 10) {
            return wx.showToast({
                title: '不能小于10字',
                duration: 2000,
                image: '/images/page/face-fail.png',
                mask: true
            })
        }

        wx.showLoading({ title: '正在打包评论...', mask: true });

        Actions.doPost({
            url: URLs.ACTIVITY_COMMENTS_ADD,
            data: {
                activity_id: that.data.activityId,
                content: val
            }
        }).then( res => {
            wx.hideLoading();
            console.log('评论结果: ', val);
            // 将评论数据立即显示
            // 获取用户头像 || 或默认头像
            let {
                avatar_url = that.data.defaults.avatar, 
                nickname = that.data.defaults.nickname
            } = wx.getStorageSync('userInfo');

            let curr_comment = {
                avatar_url, nickname, createdAt: '刚刚',
                content: val, type: 'checking'
            };
            // 填充前置数据
            let { dataController } = that.data;
            let newVal = dataController.unshift(curr_comment);
            wx.showToast({
                title: '评论成功!',
                duration: 2000,
                mask: true,
                success: function(){
                    that.setData({
                        datalist: newVal,
                        defaultComment: ''
                    });
                }
            })
            

        }).catch(err=>{
            wx.hideLoading();
            console.log('评论错误: ', val);
            return wx.showToast({
                title: '受到外星攻击...',
                duration: 2000,
                image: '/images/page/face-fail.png',
                mask: true
            })
        });
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