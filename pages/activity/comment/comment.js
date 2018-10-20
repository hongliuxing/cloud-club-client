import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
import SimpleDataController from "../../../utils/comps/SimpleDataController";

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
            // console.log('评论列表: ', res);
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
            wx.showToast({
                title: '内容不能是空的',
                duration: 0,
                mask: true
            })
        }
        if (val.length < 15) {
            wx.showToast({
                title: '不能小于15字',
                duration: 0,
                mask: true
            })
        }

        Actions.doPost({
            url: URLs.ACTIVITY_COMMENTS_ADD,
            data: {
                activity_id: that.data.activityId,
                content: val
            }
        }).then( res => {
            console.log('评论结果: ', val);
        }).catch(err=>{
            console.log('评论错误: ', val);
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