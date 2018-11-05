import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        let info = JSON.parse(options.item);
        let club = wx.getStorageSync("associationInfo");
        this.setData({
            info: info,
            notice_id: info.id,
            club_id: club.id,
            role_ability: club.role_ability
        })
    },
    onSubmit() {

        wx.showLoading({ title: '操作中...', mask: true });
        Actions.doPost({
            url: URLs.CLUBMASTER_NOTICE_REPEAL,
            data: {
                club_id: that.data.club_id,
                notice_id: that.data.notice_id
            }
        }).then(res => {
            wx.hideLoading();
            app.globalData.goBack({
                title: "删除成功"
            })
        }).catch(error => {
            wx.hideLoading();
            app.globalData.toast("数据格式有误", "loading")
        })
    },
})