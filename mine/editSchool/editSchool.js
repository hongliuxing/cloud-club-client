import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
import uploadFile from "../../utils/upload/support.js";
import {
    onStartAnimation,
    onCloseAnimation,
    searchProvine
} from "../../utils/upload/public.js";
let app = getApp();
let that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        realname: "",
        cert_url: "",
        latitude: "",
        longitude: "",
        schoolList: "",
        sid: "",
        uName: "",
        provinceList: [],
        visable: false,
        cityList: [],
        value: [0, 0],
        citycode: "",
        educ_jopArr: ["专科", "本科", "研究生", "博士", "导师"],
        educ_job: 1,
        profe: "",
        animationData: {},
        animationMask: {},
        struts: null,
        btnName: "申请",
        disabled: false,
        checked_fail_reason: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;
        let info = wx.getStorageSync("userInfo")
        if (info.school_struts != null) {
            Actions.doGet({
                url: URLs.SCHOOL_LOAD_APPLY,
                data: {}
            }).then(res => {

                let data = res.data.list[0];
                if (info.school_struts === 1 || info.school_struts === 0) {
                    that.setData({
                        cert_url: info.school_struts === 1 ? "" : data.cert_url,
                        btnName: info.school_struts === 1 ? "已通过" : "申请中",
                        disabled: true
                    })
                } else {
                    that.setData({
                        cert_url: data.cert_url,
                        disabled: false
                    })
                }
                that.setData({
                    profe: data.profe,
                    realname: data.realname,
                    struts: info.school_struts,
                    uName: info.school || "",
                    checked_fail_reason: data.checked_fail_reason
                })
                searchProvine(that, data.province_code, data.city_code)
                that.schoolList(data.city_code, data.school_id)
            }).catch(error => {

            })

        } else {
            that.addressAuth()
        }

        //判断本地是否缓存了省份列表
        if (wx.getStorageSync("province")) {
            that.setData({
                provinceList: wx.getStorageSync("province")
            })
        } else {
            that.provinceList()
        }
    },
    //地址授权button手动点击
    handlerAddress(e) {
        if (e.detail.authSetting['scope.userLocation']) {
            that.onLoaction()
        }
    },
    //进入页面自动地址授权
    addressAuth() {
        wx.getSetting({
            success: function(res) {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success(e) {
                            that.onLoaction()
                        },
                        fail(error) {
                            console.log(error)
                        }
                    })
                } else {
                    that.onLoaction()
                }
            }
        })
    },

    /**
     * 获取经纬度，
     * 查询当前地址及推送最优学校
     */
    onLoaction() {
        wx.showLoading({
            title: '正在定位...',
            mask: true
        });
        wx.getLocation({
            success: function(e) {
                let data = {
                    latitude: e.latitude,
                    longitude: e.longitude
                }
                wx.hideLoading();
                wx.showLoading({
                    title: '搜索附近学校中',
                    mask: true
                });
                Actions.doGet({
                    url: URLs.SCHOOL_NEARBY_LIST,
                    data: data
                }).then(res => {
                    wx.hideLoading();
                    let info = res.data.info
                    that.setData({
                        schoolList: info.schools,
                        proCity: info.nearby.province + " / " + info.nearby.city,
                        sid: info.nearby.sid,
                        uName: info.nearby.uName,
                    })
                }).catch(error => {
                    wx.hideLoading();
                    console.log('error:::', error)
                })
            },
            fail: function(err) {
                console.log(err, "res")
                wx.hideLoading();
            }
        })
    },
    //获取省份列表
    provinceList() {
        Actions.doGet({
            url: URLs.SCHOOL_PROVINCE_LIST,
            data: {}
        }).then(res => {
            that.setData({
                provinceList: res.data.list
            })
            wx.setStorageSync("province", res.data.list) //存入省份
        }).catch(error => {

        })
    },
    //获取input值
    onChange(e) {
        this.setData({
            [e.detail.name]: e.detail.value
        })
    },
    //打开选择城市
    openCity() {
        if (this.data.disabled) {

            return

        }
        this.setData({
            visable: !this.data.visable
        })

        if (this.data.cityList.length <= 0) {

            this.cityList(that.data.value[0])

        }
        onStartAnimation(that)
    },

    //城市列表
    cityList(index) {
        // console.log('城市索引: ', index);
        // console.log('省份编码: ', that.data.provinceList[index].code);
        Actions.doGet({
            url: URLs.SCHOOL_CITY_LIST,
            data: {
                provincecode: that.data.provinceList[index].code
            }
        }).then(res => {

            that.setData({
                cityList: res.data.list
            })

        }).catch(error => {

        })
    },
    //选择城市
    selectCity(e) {
        that.setData({
            value: e.detail.value
        })
        let index = e.detail.value[0];
        that.cityList(index)
    },
    //选择学校
    selectSchool(e) {
        let school = this.data.schoolList;
        that.setData({
            sid: school[Number(e.detail.value)].sid,
            uName: school[Number(e.detail.value)].uName,
        })
    },
    //选择学历或职务
    selectDuty(e) {
        that.setData({
            educ_job: Number(e.detail.value)
        })
    },

    //根据城市code查询所对应的学校列表
    schoolList(code, sid) { //sid  判断是不是查详情如果是显示已提交学校否则不是第一个学校
        console.log('根据城市code查询所对应的学校列表: ', code, sid);
        Actions.doGet({
            url: URLs.SCHOOL_CITYLIST,
            data: {
                citycode: code
            }
        }).then(res => {
            console.log('查到的学校列表: ', res);
            if (sid) {
                for (let i of res.data.list) {
                    if (i.sid == sid) {
                        that.setData({
                            schoolList: res.data.list,
                            uName: i.uName,
                            sid: i.sid
                        })
                        break;
                    }
                }
            } else {
                that.setData({
                    schoolList: res.data.list,
                    uName: res.data.list[0].uName,
                    sid: res.data.list[0].sid
                })
            }
        }).catch(error => {

        })
    },

    //打开选择省市区
    onSure() {
        let index = this.data.value;
        this.setData({
            proCity: this.data.provinceList[index[0]].name + " / " + this.data.cityList[index[1]].name,
            citycode: this.data.cityList[index[1]].code
        })
        that.schoolList(this.data.cityList[index[1]].code)
        onCloseAnimation(that)
    },

    //关闭选择省市区
    onClose() {
        onCloseAnimation(that)
    },

    //提交
    onSubmit(e) {
        if (this.data.profe == "") {
            return app.globalData.toast("请描述所学专业?")
        }
        if (this.data.realname == "") {
            return app.globalData.toast("请输入您的姓名?")
        }
        if (this.data.cert_url == "") {
            return app.globalData.toast("请上传手持身份证或学生证照片?")
        }
        let data = {
            school_id: this.data.sid,
            profe: this.data.profe,
            educ_job: this.data.educ_job,
            realname: this.data.realname,
            cert_url: this.data.cert_url,
            formId: e.detail.formId
        }

        wx.showLoading({ title: '发送数据...', mask: true });
        Actions.doPost({
            url: URLs.SCHOOL_SETTING,
            data: data
        }).then(res => {
            wx.hideLoading();
            let currInfo = wx.getStorageSync("userInfo");
            if (currInfo) {
                currInfo["school_struts"] = 0;
                wx.setStorageSync('userInfo', currInfo);
            } else {
                wx.setStorageSync('userInfo', {
                    school_struts: 0
                });
            }

            wx.setStorageSync("mineRefresh", true)
            app.globalData.toast("设置申请成功", "success")

            setTimeout(function() {
                wx.navigateBack({
                    delta: 1
                })
            }, 800)
            
        }).catch(error => {
            wx.hideLoading();
            app.globalData.toast("数据格式有误", "loading")
        })

    },
    //上传照片
    changeImage() {

        if (this.data.disabled) return;
        
        wx.chooseImage({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ['album', 'camera'],
            success: function(res) {
                wx.showLoading({ title: '正在上传', mask: true });
                Actions.uploadSign.pid(res.tempFilePaths[0])
                    .then((uploadRes) => {
                        wx.hideLoading()
                        if (uploadRes.errMsg == "uploadFile:ok") {
                            that.setData({
                                cert_url: uploadRes.pic
                            })
                        }
                    })
                    .catch(err => {
                        wx.hideLoading()
                        app.globalData.toast("上传出现异常", "loading")
                        console.log('上传错误：：', err);
                    });
            },
            fail: function(){
                
            }
        })

    },

})