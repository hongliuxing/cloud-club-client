import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBtns:[],
    image:true,
    case:true,
    height:140,
    table:1,
    applyingList:[],//申请中列表
    applyPagenum:1, //申请中页码
    applyRefresh:true, //申请中加载下一页
    applyHistoryPagenum: 1,//申请历史页码
    applyHistoryList: [],//申请历史列表
    applyHistoryRefresh: true //申请历史加载下一页

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // 标签页频道组件
    let topBtns = [
      { title: "申请中", btype: "event", value: (e) => this.applying(e) },
      { title: "申请历史", btype: "event", value:(e)=> this.applyHistory(e) }
    ];
    this.setData({
      topBtns: topBtns
    });
    that._request(0, 1)
  },

  //申请中
  applying(e){
    if (this.data.table===1){
         return
    }else{
       that.setData({
         table:1
       })
    }
    that._request(0,1)
  },

  //申请历史
  applyHistory(e) {
    if (this.data.table === 2) {
      return
    } else {
      that.setData({
        table: 2
      })
    }
    that._request(1, 1)
  },

  _request(struts, pagenum){
    Actions.doGet({
        url: URLs.CLUBMASTER_BUILD_APPLY_LIST,
        data:{
          struts: struts,
          pagenum: pagenum
        }
    }).then(res=>{
       console.log(res,"88888888")
    }).catch(error=>{

    })
  }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //添加
  add(){
    app.globalData.goToPage("../addAssociation/addAssociation")
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})