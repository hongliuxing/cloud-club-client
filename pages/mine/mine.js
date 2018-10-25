import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
let app = getApp();
let that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        urlSchool: "../../mine/editSchool/editSchool",
        myAssociation: "../../mine/myAssociation/myAssociation",
        luckExplain: "../../mine/luckExplain/luckExplain",
        sportExplain: "../../mine/sportExplain/sportExplain",
        info: {},
        school: null,
        status: null, //学校状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        wx.showLoading({
            title: '正在组装社团...',
            mask: true
        });
        that._request()
    },

    //请求
    _request() {
        // Actions.doGet({
        //   url: URLs.USER_PANEL_INFO,
        //   data: {}
        // }).then(res => {
        //  wx.hideLoading()

        let currInfo = wx.getStorageSync("userInfo");
        if (!currInfo) {
            wx.hideLoading();
            return;
        }
        let status = currInfo.school_struts;
        let name = "";
        if (status == 1) {
            name = "已通过"
        } else if (status == 0) {
            name = "申请中"
        } else if (status == -1) {
            name = "未通过"
        } else {
            name = "未设置"
        }

        that.setData({
            info: currInfo,
            school: name,
            status: status,
            canPullTorch: currInfo.can_pull_torch
        })
        wx.hideLoading();
        //   wx.setStorageSync("userInfo", res.data.info)
        // }).catch(err => {
        //   console.log('我的社团 err: ', err);
        // });
    },
    //修改信息页面
    goToUser() {
        app.globalData.goToPage("../../mine/person/person?userinfo=" + JSON.stringify(this.data.info))
    },
    //页面跳转
    goTo(e) {
        if (this.data.myAssociation == e.detail.url) {
            if (this.data.status == null) {
                app.globalData.toast("请先设置学校")
                return
            }
        }
        app.globalData.goToPage(e.detail.url)
    },
    /**
     * 获取火把的事件
     */
    onPullTorch(e){
        let that = this;
        console.log('获取火把:: ', e);
        // 首先判断是否可以获取火把
        let uinfo = wx.getStorageSync('userInfo');
        if (uinfo['can_pull_torch'] !== 1){
            // 不能领取
            return that.onToast('不能重复领取');
        }
        // 否则进入领取环节
        wx.showLoading({
            title: '正在传递火把...',
            mask: true
        });
        // 获取火把的过程
        Actions.doPost({
            url: URLs.TORCH_PULL
        }).then(res => {
            wx.hideLoading();
            if(res.data.err){
                console.log('获取火把错误: ', res);
                return that.onToast('服务器繁忙');
            }
            // 变更领取状态 及 火把数量
            let torch_count = res.data.info.result;
            if (torch_count === -1){
                return that.onToast('请先设置用户信息');
            } else if (torch_count === 0) {
                return that.onToast('今天领过啦');
            } else if (torch_count > 0) {
                that.onToast('领到 ' + torch_count + '个火把!');
                uinfo['can_pull_torch'] = 0;
                wx.setStorageSync('userInfo', uinfo);
                that.setData({ canPullTorch: 0 });
            }

        }).catch(err => {
            wx.hideLoading();
            console.log('获取火把异常: ', err);
        });
    },

    onToast(title){
        return wx.showToast({
            title: title,
            image: '/images/page/face-fail.png',
            duration: 1500,
            mask: true
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

        if (wx.getStorageSync("mineRefresh")) {
            that._request()
        }
    },

})