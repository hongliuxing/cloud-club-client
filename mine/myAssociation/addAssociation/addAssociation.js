import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
import uploadFile from "../../../utils/upload/support.js";
let app = getApp();
let that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        school: "",
        author: "",
        phone: "",
        school_id: "",
        title: "",
        referrer: "", //推荐人
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        let info = wx.getStorageSync("userInfo");
        that.setData({
            school: info.school,
            school_id: info.school_id,
            phone: info.telephone,
            author: info.realname
        })
    },
    //获取input值
    onChange(e) {
        this.setData({
            [e.detail.name]: e.detail.value
        })
    },

    //提交
    onSubmit(e) {
        if (this.data.title == "") {
            return app.globalData.toast("请输入社团名称?")
        }
        if (this.data.cert_url == "") {
            return app.globalData.toast("请上传社团合影?")
        }
        let data = {
            school_id: this.data.school_id,
            club_url: this.data.cert_url,
            title: this.data.title,
            referrer: this.data.referrer,
            formId: e.detail.formId
        }

        wx.showLoading({ title: '发送数据...', mask: true });
        Actions.doPost({
            url: URLs.CLUBMASTER_CREATE_CLUB,
            data: data
        }).then(res => {
            wx.hideLoading();
            wx.setStorageSync('addAssociation', true)
            app.globalData.goBack({
                title: "申请成功"
            })

        }).catch(error => {
            wx.hideLoading();
            if (error.data.err.errCode == 103) {
                app.globalData.toast("已存在相同名称的社团")
            } else {
                app.globalData.toast("数据格式有误", "loading")
            }
        })

    },

    //上传照片
    changeImage() {
        wx.chooseImage({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ['album', 'camera'],
            success: function(res) {
                wx.showLoading({
                    title: '正在上传',
                    mask: true,
                })
                Actions.uploadSign.clubApply(res.tempFilePaths[0])
                    .then((uploadRes) => {
                        wx.hideLoading()
                        if (uploadRes.errMsg == "uploadFile:ok") {
                            that.setData({
                                cert_url: uploadRes.pic
                            })
                            app.globalData.toast("上传成功")
                        }
                    })
                    .catch(err => {
                        wx.hideLoading()
                        app.globalData.toast("上传错误")
                    });
            },
        })

    }
})