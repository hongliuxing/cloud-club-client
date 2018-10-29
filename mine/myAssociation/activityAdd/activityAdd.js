import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
import uploadFile from "../../../utils/upload/support.js";
import { uploadUtilActivity, uploadToAliossActivity} from "../../../utils/net/Actions.js";
import {repeat} from "../../../utils/upload/public.js";
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
    imageList:[],
    delImageList:[],
    content:"",
    club_id:"",
    activity_id:"",
    isLook:null,
    isSave:false,
    isRepeat:true,//防止重复提交
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let data = JSON.parse(options.data);
    if (data.isAdd==1){ //判断是编辑查看还是添加
      let info = wx.getStorageSync("userInfo");
      let item = wx.getStorageSync("associationInfo");
      that.setData({
        titleName: item.title,
        author: info.realname,
        club_id: item.id
      })
    }else{
     that.setData({
       isLook:data.isLook,
       activity_id:data.id  
     })

     if(data.isLook==1){
       that.setData({
         isSave:true
       })
     }
      that._detail(data.id) //查详情
    }
  },
  
  //查详情
  _detail(id){
    Actions.doGet({
      url: URLs.ACTIVITY_SIMPLE_INFO,
      data: {activity_id:id}

    }).then(res => {
      let data = res.data.info;
      let arr =[];
      for(let i of data.imgs){
        arr.push(i.pic_url)
      }
      that.setData({
        titleName: data.club_title,
        club_id: data.club_id,
        title: data.title,
        content: data.content,
        imageList: arr
      })
    }).catch(error => {

    })
  },

  //获取input值
  onChange(e) {
    if(this.data.isLook==1){
      that.setData({
        isSave: false
      })
    }
    this.setData({
      [e.detail.name]: e.detail.value
    })
  },
  //活动内容
  onChangeText(e){
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
    if (!that.data.isRepeat){
       return
    }
    repeat(that)
    if (this.data.isSave){
      return
    }
    if (this.data.title == "") {

      app.globalData.toast("请输入活动标题?")

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
      club_id: this.data.club_id,
      content: this.data.content,
      title: this.data.title,
      imgs: that.data.imageList,
    }
    if (that.data.activity_id) { data["activity_id"] = that.data.activity_id}
    Actions.doPost({
      url: URLs.CLUBMASTER_ACTIVITY_SAVE,
      data: data
    }).then(res => {
      that.requestDel()
      that.setData({
        isSave: true
      })
    }).catch(error => {

    })

  },

  //发布
  onPublish() {
    if (!this.data.isSave) {
      return
    }
    Actions.doPost({
      url: URLs.CLUBMASTER_ACTIVITY_SAVE,
      data: {
        activity_id: that.data.activity_id
      }
    }).then(res => {

      app.globalData.goBack({ title: "发布成功" })

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
      success: function (res) {
        wx.showLoading({
          title: '正在上传',
          mask: true,
        })
        uploadUtilActivity(URLs.UPLOAD_CLUB_ACTIVITY_PIC, res.tempFilePaths[0]).then(result=>{
          let arr = [];
          const { url, key, policy, OSSAccessKeyId, signature } = result.data.formData;
          for (let i = 0; i < res.tempFilePaths.length;i++){
            arr.push(that.uploadImage({ filepath: res.tempFilePaths[i], url, key: encodeURI(res.tempFilePaths[i]), policy, OSSAccessKeyId, signature }))
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

        }).catch(error=>{
          
          wx.hideLoading()
          app.globalData.toast("存在上传失败，请重新上传")
        })
      },
    })
  },
  

  //多张上传
  uploadImage({ filepath, url, key, policy, OSSAccessKeyId, signature }){
    return new Promise((resolve, reject)=>{
      uploadToAliossActivity({ filepath, url, key, policy, OSSAccessKeyId, signature }).then(res => {
          resolve(res)
        }).catch(error => {
          console.log("上传失败")
          reject(error)
        })
    })
  },

  //删除图片
  onDel(e){
    if (this.data.isLook == 1) {
      that.setData({
        isSave: false
      })
    }
    let index = e.currentTarget.dataset.index;
    let delImage = that.data.delImageList;
    delImage.push(that.data.imageList[index])
    let arr = that.data.imageList;
    arr.splice(index,1)
    that.setData({
      imageList: arr,
      delImageList: delImage
    })
  },

  //提交删除
  requestDel(){
    if (that.data.delImage.length==0){
        return
    }
    let data = {
      imgs:that.data.delImage
    }
    if (that.data.activity_id) { data["activity_id"] = that.data.activity_id }
    Actions.doPost({
      url: URLs.CLUBMASTER_ACTIVITY_DELETE_IMGS,
      data: data
    }).then(res => {
       console.log(res)
    }).catch(error => {

    })
  }
})