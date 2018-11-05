import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
import {
    getNextMonth
} from "../../../utils/upload/public.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        title: "", //社团名称
        createdAt: "", //判断是上一次修改时间
        titleDis: false, //判断是否可以修改title
        intro: "", //社团简介
        role_ability: null,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        let item = wx.getStorageSync("associationInfo");
        if (item) {
            that.setData({
                role_ability: item.role_ability,
                club_id: item.id
            })
            that._request(item.id)
        }
    },
    //title
    onChange(e) {
        that.setData({
            [e.detail.name]: e.detail.value
        })

    },
    //社团资料
    onChangeText(e) {
        that.setData({
            intro: e.detail.value
        })
    },
    //社团联系人请求
    _request(clubid) {
        wx.showLoading({ title: '载入数据...', mask: true });
        Actions.doGet({
            url: URLs.CLUB_DETAIL_INFO,
            data: {
                clubid: clubid,
            }
        }).then(res => {
            wx.hideLoading();
            if (res.data.info.title_updatedAt) {
                let mouthAfter = getNextMonth(res.data.info.title_updatedAt.split(" ")[0]);
                let mouthAfterAll = new Date(mouthAfter + " " + res.data.info.title_updatedAt.split(" ")[1]).getTime();
                let nowTime = new Date().getTime();
                if (nowTime > mouthAfterAll) {
                    that.setData({
                        titleDis: false
                    })
                } else {
                    that.setData({
                        titleDis: true
                    })
                }
            }

            that.setData({
                info: res.data.info,
                title: res.data.info.title,
                logo_url: res.data.info.logo_url,
                intro: res.data.info.intro
            })
        }).catch(error => {
            wx.hideLoading();
            app.globalData.toast("载入数据异常")
        })
    },

    //保存修改
    onSubmit() {
        let resData = {
            club_id: that.data.club_id,
            title: that.data.title,
            logo_url: that.data.logo_url,
            intro: that.data.intro
        }

        wx.showLoading({ title: '操作中...', mask: true });
        Actions.doPost({
            url: URLs.CLUBMASTER_MOFIFY_CLUB,
            data: resData
        }).then(res => {
            wx.hideLoading();
            wx.setStorageSync("associationIsChange", true)
            app.globalData.goBack({
                title: "保存成功"
            })
        }).catch(error => {
            wx.hideLoading();
            app.globalData.toast("数据格式有误", "loading")
        })
    },

    //图片上传
    //上传照片
    changeImage() {
        if (that.data.role_ability !== 3 && that.data.role_ability !== 4) {

            return

        }
        wx.chooseImage({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ['album', 'camera'],
            success: function(res) {
                wx.showLoading({
                    title: '正在上传...',
                    mask: true
                })
                Actions.uploadSign.clubLogo(that.data.club_id, res.tempFilePaths[0])
                    .then((uploadRes) => {
                        wx.hideLoading();
                        if (uploadRes.errMsg == "uploadFile:ok") {
                            that.setData({
                                logo_url: uploadRes.pic
                            })
                            app.globalData.toast("上传成功")
                        }
                    })
                    .catch(err => {
                        wx.hideLoading();
                        console.log('上传错误：：', err);
                    });
            },
        })

    },
})