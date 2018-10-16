import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
import uploadFile from "../../utils/upload/support.js";
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
    animationData:{},
    animationMask:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    /**
     * 获取经纬度，
     * 查询当前地址及推送最优学校
     */
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

    that.provinceList()

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
    this.setData({
      visable: !this.data.visable
    })

    if (this.data.cityList.length <= 0) {

      this.cityList(that.data.value[0])

    }
    that.onStartAnimation()
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
    this.onCloseAnimation()
  },

  //关闭选择省市区
  onClose() {
    this.onCloseAnimation()
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

       setTimeout(function(){
         wx.navigateBack({
           delta: 1
         })
       },500)

    }).catch(error => {

    })

  },

  //上传照片
  changeImage() {
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
  
  //选择省市打开动画
  onStartAnimation() {
    var animation = wx.createAnimation({
      duration: 150,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 0)
    var animation2 = wx.createAnimation({
      timingFunction: 'linear'
    })
    // 遮罩渐变动画
    var animationMask = wx.createAnimation({
      duration: 150,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    animationMask.opacity(1).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });
  },
  //选择省市关闭动画
  onCloseAnimation() {
    var animation = wx.createAnimation({
      duration: 150,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(0).step()
    that.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(300).step()
      that.setData({
        animationData: animation.export()
      })
    }, 0)
    // 遮罩渐变动画
    var animationMask = wx.createAnimation({
      duration: 150,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    that.animationMask.opacity(0).step();
    setTimeout(function () {
      that.setData({
        animationMask: that.animationMask.export(),
        visable: false
      });
    }, 150)
  }

})