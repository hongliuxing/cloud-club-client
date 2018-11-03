import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
import uploadFile from "../../../utils/upload/support.js";
import {
  uploadUtilActivity,
  uploadToAliossActivity
} from "../../../utils/net/Actions.js";
import {
  repeat
} from "../../../utils/upload/public.js";
let app = getApp();
let that;
Page({

  data: {
    school: "",
    author: "",
    phone: "",
    school_id: "",
    title: "",
    imageList: [],
    delImageList: [],
    content: "",
    club_id: "",
    activity_id: "",
    isLook: null,
    isSave: false,
    isRepeat: true, //防止重复提交
    oldImageList:[],//编辑时需要记录原来照片数组
    isAdd:1,
    opportunityArr: ["筹办期","活动总结"],
    timing:0,
    brief_start:"",
    brief_end: "",
    start_date:"年/月/日",
    start_time: "时:分",
    end_date: "年/月/日",
    end_time: "时:分"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    let data = JSON.parse(options.data);
    if (data.isAdd == 1) { //判断是编辑查看还是添加
      let info = wx.getStorageSync("userInfo");
      let item = wx.getStorageSync("associationInfo");
      that.setData({
        titleName: item.title,
        author: info.realname,
        club_id: item.id,
        isAdd: data.isAdd
      })
    } else {
      that.setData({
        isLook: data.isLook,
        activity_id: data.id,
        isAdd: data.isAdd
      })

      if (data.isLook == 1) {
        that.setData({
          isSave: true
        })
      }
      that._detail(data.id) //查详情
    }
  },

  //查详情
  _detail(id) {
    Actions.doGet({
      url: URLs.CLUBMASTER_EDIT_INFO,
      data: {
        activity_id: id
      }

    }).then(res => {
      let data = res.data.info;
      let start = data.brief_start.split(" ");
      let end = data.brief_end.split(" ");
      that.setData({
        titleName: data.club_title,
        club_id: data.club_id,
        author: data.realname,
        title: data.title,
        content: data.content,
        imageList: data.imgs,
        oldImageList: data.imgs, //编辑时需要记录原来照片数组,
        timing: data.timing,
        start_date: start[0],
        start_time: start[1],
        end_date: end[0],
        end_time: end[1]
      })
    }).catch(error => {

    })
  },

  //选择活动时机
  onSelectOpportunity(e){
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }
    that.setData({
      timing:e.detail.value
    })
  },
  /**************选择开始日期************* */
  //选择开始日期
  startDate(e){
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }
    that.setData({
      start_date:e.detail.value
    })
  },
 //选择开始时间
  startTime(e){
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }
    that.setData({
      start_time: e.detail.value
    })
  },

  /**************选择结束日期************* */
  //选择结束日期
  endDate(e) {
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }
    that.setData({
      end_date: e.detail.value
    })
  },
  //选择结束时间
  endTime(e){
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }
    that.setData({
      end_time: e.detail.value
    })
  },
  //获取input值
  onChange(e) {
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }
    this.setData({
      [e.detail.name]: e.detail.value
    })
  },
  //活动内容
  onChangeText(e) {
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }
    this.setData({
      content: e.detail.value
    })
  },
  //保存
  onSubmit() {
    if (!that.data.isRepeat) {
      return
    }
    repeat(that)
    if (this.data.isSave) {
      return
    }
    if (this.data.title == "") {

      app.globalData.toast("请输入活动标题?")

      return
    }
    if (this.data.start_date == "年/月/日") {

      app.globalData.toast("请选择开始时间的日期?")

      return
    }
    if (this.data.start_time == "时:分") {

      app.globalData.toast("请选择开始时间的时分?")

      return
    }
    if (this.data.end_date == "年/月/日") {

      app.globalData.toast("请选择结束时间的日期?")

      return
    }
    if (this.data.end_time == "时:分") {

      app.globalData.toast("请选择结束时间的时分?")

      return
    }
    let brief_start = this.data.start_date + " " + this.data.start_time; //开始时间
    let brief_end = this.data.end_date + " " + this.data.end_time;//结束时间

    if (new Date(brief_start).getTime() > new Date(brief_end).getTime()){

      app.globalData.toast("开始时间不能大于结束时间?")

      return
    }
    if (this.data.content == "") {

      app.globalData.toast("请输入活动内容呢?")

      return
    }
    if (this.data.imageList.length == 0) {

      app.globalData.toast("请上传活动图片?")

      return
    }
    let data = {
      club_id: that.data.club_id,
      content: that.data.content,
      title: that.data.title,
      imgs: that.data.imageList,
      timing: that.data.timing,
      brief_start: brief_start,
      brief_end: brief_end
    }
    if (that.data.activity_id) {
      data["activity_id"] = that.data.activity_id
      let array = [];
      array = that.data.imageList.filter((item) => { return that.data.oldImageList.indexOf(item) === -1})
      data["imgs"] = array
    }

    Actions.doPost({
      url: URLs.CLUBMASTER_ACTIVITY_SAVE,
      data: data
    }).then(res => {
      that.setData({
        isSave: true,
        activity_id: res.data.info.activity_id ? res.data.info.activity_id : that.data.activity_id,
        oldImageList: that.data.imageList
      })
      if (that.data.isAdd==1){
        wx.setStorageSync("isActivityRefersh", true)
      }
      
    }).catch(error => {

    })

  },
  //查看大图
  onBigImage(e){
    wx.previewImage({
      urls: that.data.imageList,
      current: e.currentTarget.dataset.image
    })
  },
  //发布
  onPublish() {
    if (!this.data.isSave) {
      return
    }
    Actions.doPost({
      url: URLs.CLUBMASTER_ACTIVITY_PUBLISH,
      data: {
        activity_id: that.data.activity_id
      }
    }).then(res => {
      wx.setStorageSync("isActivityRefersh",true)
      app.globalData.goBack({
        title: "申请成功"
      })

    }).catch(error => {

    })

  },
  //上传照片
  changeImage() {
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }
    wx.chooseImage({
      count: 9 - (that.data.imageList.length),
      sizeType: ["compressed"],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '正在上传',
          mask: true,
        })
        uploadUtilActivity(URLs.UPLOAD_CLUB_ACTIVITY_PIC, res.tempFilePaths[0]).then(result => {
          let arr = [];
          const {
            url,
            key,
            policy,
            OSSAccessKeyId,
            signature
          } = result.data.formData;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            arr.push(that.uploadImage({
              filepath: res.tempFilePaths[i],
              url,
              key: encodeURI(res.tempFilePaths[i].replace("http://tmp/",'') + Math.ceil(Math.random() * 10)),
              policy,
              OSSAccessKeyId,
              signature
            }))
          }
          Promise.all(arr)
            .then(resultList => {
              let arr = that.data.imageList;
              arr = arr.concat(resultList)
              that.setData({
                imageList: arr
              })
              wx.hideLoading()
              app.globalData.toast("上传完成")
            });

        }).catch(error => {

          wx.hideLoading()
          app.globalData.toast("存在上传失败，请重新上传")
        })
      },
    })
  },


  //多张上传
  uploadImage({
    filepath,
    url,
    key,
    policy,
    OSSAccessKeyId,
    signature
  }) {
    return new Promise((resolve, reject) => {
      uploadToAliossActivity({
        filepath,
        url,
        key,
        policy,
        OSSAccessKeyId,
        signature
      }).then(res => {
        resolve(res)
      }).catch(error => {
        console.log("上传失败")
        reject(error)
      })
    })
  },

  //删除图片
  onDel(e) {
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }

    let index = e.currentTarget.dataset.index;

    let delImage = [];

    delImage.push(that.data.imageList[index]);

    that.requestDel(index,delImage)
  },

  //删除
  requestDel(index,imageArr) {
    if (imageArr.length == 0) {
      return
    }
    let data = {
      imgs: imageArr
    }
    if (that.data.activity_id) {
      data["activity_id"] = that.data.activity_id
    }
    Actions.doPost({
      url: URLs.CLUBMASTER_ACTIVITY_DELETE_IMGS,
      data: data
    }).then(res => {
      let arr = that.data.imageList;
      arr.splice(index, 1)
      that.setData({
        imageList: arr,
      })
    }).catch(error => {
      console.log(error)
    })
  }
})