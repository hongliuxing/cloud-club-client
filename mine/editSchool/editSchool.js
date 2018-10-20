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
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    let info = wx.getStorageSync("userInfo")
    if (info.school_struts === 1 || info.school_struts === 0) {
      Actions.doGet({
        url: URLs.SCHOOL_LOAD_APPLY,
        data: {}
      }).then(res => {
        let data = res.data.list[0];

        that.setData({
          cert_url: data.cert_url,
          profe: data.profe,
          realname: data.realname,
          struts: info.school_struts,
          btnName: info.school_struts === 1 ? "已通过" : "申请中",
          uName: info.school,
          disabled:true
        })
        searchProvine(that,data.province_code, data.city_code)
      }).catch(error => {

      })

    } else {
      that.onLocation()
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



  /**
   * 获取经纬度，
   * 查询当前地址及推送最优学校
   */
  onLocation() {
    wx.getLocation({
      success: function(res) {
        let data = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        Actions.doGet({
          url: URLs.SCHOOL_NEARBY_LIST,
          data: data
        }).then(res => {
          let info = res.data.info
          that.setData({
            schoolList: info.schools,
            proCity: info.nearby.province + " / " + info.nearby.city,
            sid: info.nearby.sid,
            uName: info.nearby.uName,
          })
        }).catch(error => {

        })
      },
      fail: function(err) {
        console.log(err, "res")
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
  schoolList(code) {
    Actions.doGet({
      url: URLs.SCHOOL_CITYLIST,
      data: {
        citycode: code
      }
    }).then(res => {

      that.setData({
        schoolList: res.data.list,
        uName: res.data.list[0].uName,
        sid: res.data.list[0].sid
      })

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
  onSubmit() {
    if (this.data.profe == "") {

      app.globalData.toast("请描述所学专业?")

      return
    }
    if (this.data.realname == "") {

      app.globalData.toast("请输入您的姓名?")

      return
    }
    if (this.data.cert_url == "") {

      app.globalData.toast("请上传手持身份证或学生证照片?")

      return
    }
    let data = {
      school_id: this.data.sid,
      profe: this.data.profe,
      educ_job: this.data.educ_job,
      realname: this.data.realname,
      cert_url: this.data.cert_url
    }
    Actions.doPost({
      url: URLs.SCHOOL_SETTING,
      data: data
    }).then(res => {
      app.globalData.toast("申请成功")

      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        })
      }, 500)
      wx.setStorageSync("mineRefresh", true)
    }).catch(error => {

    })

  },

  //上传照片
  changeImage() {
    if (this.data.disabled) {

      return

    }
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ['album', 'camera'],
      success: function(res) {
        Actions.uploadSign.pid(res.tempFilePaths[0])
          .then((uploadRes) => {
            if (uploadRes.errMsg == "uploadFile:ok") {
              that.setData({
                cert_url: uploadRes.pic
              })
            }
          })
          .catch(err => {
            console.log('上传错误：：', err);
          });
      },
    })

  },

})