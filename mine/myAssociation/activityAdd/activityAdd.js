import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
import uploadFile from "../../../utils/upload/support.js";
import { uploadUtilActivity, uploadToAliossActivity} from "../../../utils/net/Actions.js";
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
    isLook:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let info = wx.getStorageSync("userInfo");
    let item = wx.getStorageSync("associationInfo");
    that.setData({
      titleName: item.title,
      author: info.realname,
      club_id: item.id
    })
    if (options.data){
      let data = JSON.parse(options.data);
      that.setData({
        isLook: data.isLook,
        title:data.info.title
      })

    }
  },
  //获取input值
  onChange(e) {
    this.setData({
      [e.detail.name]: e.detail.value
    })
  },
  //活动内容
  onChangeText(e){
    this.setData({
      content: e.detail.value
    })
  },
  //提交
  onSubmit() {
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
      app.globalData.goBack({ title: "保存成功" })

    }).catch(error => {

    })

  },
  
  //上传照片
  changeImage() {
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