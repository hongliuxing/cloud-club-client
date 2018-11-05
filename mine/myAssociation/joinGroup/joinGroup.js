import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        table: 1,
        aa: 123,
        pagenum: 1,
        canapplyrefresh: true,
        canapplyList: [],
        applyList: [],
        applyrefresh: true,
        applyPagenum: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 标签页频道组件
        that = this;
        let topBtns = [{
                title: "本校社团列表",
                btype: "event",
                value: (e) => this.Associations()
            },
            {
                title: "申请历史",
                btype: "event",
                value: (e) => this.applyHistory()
            }
        ];
        this.setData({
            topBtns: topBtns
        });
        that.canapplyList(1)
    },

    //本校社团
    Associations() {
        if (this.data.table === 1) {
            return
        } else {
            that.setData({
                table: 1
            })
        }
        if (that.data.canapplyList.length > 0) {
            return
        } else {
            that.canapplyList(1)
        }

    },

    //申请历史
    applyHistory() {
        if (this.data.table === 2) {
            return
        } else {
            that.setData({
                table: 2
            })
        }
        if (that.data.applyList.length > 0) {
            return
        } else {
            that.applyList(1)
        }

    },

    //可加入列表
    canapplyList(pageindex) {
        let arr = pageindex == 1 ? [] : that.data.canapplyList;
        wx.showLoading({ title: '载入数据...', mask: true });
        Actions.doGet({
            url: URLs.CLUB_SELF_CANAPPLY_LIST,
            data: {
                pagenum: pageindex
            }
        }).then(res => {
            wx.hideLoading();
            if (res.data.list.length > 0) {
                that.setData({
                    canapplyrefresh: true,
                })
            } else {
                that.setData({
                    canapplyrefresh: false,
                })
            }
            arr = arr.concat(res.data.list)
            that.setData({
                canapplyList: arr,
                pagenum: pageindex
            })
            wx.stopPullDownRefresh()
        }).catch(error => {
            wx.hideLoading();
            app.globalData.toast("载入数据异常")
        })
    },


    //历史申请列表
    applyList(pageindex) {
        let arr = pageindex == 1 ? [] : that.data.applyList;
        wx.showLoading({ title: '载入数据...', mask: true });
        Actions.doGet({
            url: URLs.CLUB_SELF_APPLY_LIST,
            data: {
                pagenum: pageindex
            }
        }).then(res => {
            wx.hideLoading();
            if (res.data.list.length > 0) {
                that.setData({
                    applyrefresh: true,
                })
            } else {
                that.setData({
                    applyrefresh: false,
                })
            }
            arr = arr.concat(res.data.list)
            that.setData({
                applyList: arr,
                applyPagenum: pageindex
            })
            wx.stopPullDownRefresh()
        }).catch(error => {
            wx.hideLoading();
            app.globalData.toast("载入数据异常")
        })
    },

    //跳转详情
    Goto(e) {
        let id = e.detail.id;
        let isAttention = e.detail.isAttention;
        app.globalData.goToPage("../../../pages/clubinfo/clubinfo?club_id=" + id + "&isAttention=" + isAttention)
    },

    //申请入团
    onApply(e) {
        console.log('申请入团: ', e);
        let id = e.detail.child;
        let index = e.detail.index;

        wx.showLoading({ title: '发送数据...', mask: true });
        Actions.doPost({
            url: URLs.CLUB_SELF_JOIN,
            data: {
                clubid: id,
                formId: e.detail.formId
            }
        }).then(res => {
            wx.hideLoading();
            if (res.data) {
                let clun_id = res.data.info.club_id;
                if (clun_id == id) {
                    let arr = that.data.canapplyList;
                    arr[index].last_apply_struts = 0;
                    that.setData({
                        canapplyList: arr
                    })
                    app.globalData.toast("申请成功")
                }
            }

        }).catch(error => {
            wx.hideLoading();
            console.log('申请失败:', error);
            app.globalData.toast("服务器繁忙")
        })
    },

    onChange(e) {
        this.setData({
            k: e.detail.value
        })
    },

    onSearch() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

        if (that.data.table == 1) {

            that.canapplyList(1)

        } else {

            that.applyList(1)
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (that.data.table == 1) {
            if (that.data.canapplyrefresh) {
                that.canapplyList(that.data.pagenum + 1)
            }
        } else {
            if (that.data.applyrefresh) {
                that.applyList(that.data.applyPagenum + 1)
            }
        }
    },

})