import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        clubid: "",
        pagenum: 1,
        refresh: true,
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        let info = wx.getStorageSync("associationInfo");
        if (info) {
            that.setData({
                clubid: info.id,
                role_ability: info.role_ability //拿到权限判断是否有添加权限
            })
        }
        wx.setStorageSync("associationIsChange", true)
    },

    onShow() {
        that._request({
            clubid: that.data.clubid,
            pagenum: 1
        })
    },
    //添加
    add() {
        app.globalData.goToPage("../noticeAdd/noticeAdd")
    },
    //请求
    _request({
        clubid = this.data.clubid,
        pagenum = this.data.pagenum
    }) {
        let arr = pagenum == 1 ? [] : that.data.list;
        wx.showLoading({ title: '载入数据...', mask: true });
        Actions.doGet({
            url: URLs.CLUB_NOTICE_LIST,
            data: {
                clubid: clubid,
                pagenum: pagenum
            }
        }).then(res => {
            wx.hideLoading();
            arr = arr.concat(res.data.list)
            if (res.data.list.length > 0) {
                that.setData({
                    refresh: true
                })
            } else {
                that.setData({
                    refresh: false
                })
            }
            that.setData({
                list: arr,
                pagenum: pagenum
            })
            wx.stopPullDownRefresh()
        }).catch(error => {
            wx.hideLoading();
            app.globalData.toast("载入数据异常")
        })
    },

    //跳转详情
    goTo(e) {
        let index = Number(e.currentTarget.dataset.index);
        app.globalData.goToPage("../noticeInfo/noticeInfo?item=" + JSON.stringify(this.data.list[index]))
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        that._request({
            pagenum: 1
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (that.data.refresh) {
            that._request({
                pagenum: that.data.pagenum + 1
            })
        }
    },
})