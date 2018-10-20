import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topBtns: [],
    image: true,
    case: true,
    height: 140,
    table: 1,
    applyingList: [], //申请中列表
    applyPagenum: 1, //申请中页码
    applyRefresh: true, //申请中加载下一页
    applyHistoryPagenum: 1, //申请历史页码
    applyHistoryList: [], //申请历史列表
    applyHistoryRefresh: true //申请历史加载下一页

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    // 标签页频道组件
    let topBtns = [{
        title: "申请中",
        btype: "event",
        value: (e) => this.applying(e)
      },
      {
        title: "申请历史",
        btype: "event",
        value: (e) => this.applyHistory(e)
      }
    ];
    this.setData({
      topBtns: topBtns
    });
    that._request(0, 1)
  },

  //申请中
  applying(e) {
    if (this.data.table === 1) {
      return
    } else {
      that.setData({
        table: 1
      })
      if (this.data.applyingList.length > 0) {
        return
      } else {
        that._request(0, 1)
      }
    }

  },

  //申请历史
  applyHistory(e) {
    if (this.data.table === 2) {
      return
    } else {
      that.setData({
        table: 2
      })
      if (this.data.applyHistoryList.length > 0) {
        return
      } else {
        that._request(1, 1)
      }
    }

  },
  /**
   *  请求根据struts区分申请中还是申请历史，applyRefresh和applyHistoryRefresh
   *  判断是否执行下一页请求，applyingList和applyHistoryList分别为两个页面数组，
   * applyHistoryPagenum和applyPagenum为当前请求各自的页码。
   * 
   */
  _request(struts, pagenum) {
    Actions.doGet({
      url: URLs.CLUBMASTER_BUILD_APPLY_LIST,
      data: {
        struts: struts,
        pagenum: pagenum
      }
    }).then(res => {
      if (struts == 0) {
        let applyingList = pagenum == 1 ? [] : this.data.applyingList; //申请中
        applyingList = applyingList.concat(res.data.list)
        if (res.data.list.length > 0) {
          that.setData({
            applyRefresh: true,
          })
        } else {
          that.setData({
            applyRefresh: false,
          })
        }

        that.setData({
          applyPagenum: pagenum,
          applyingList: applyingList
        })

      }else{
        let applyHistoryList = pagenum == 1 ? [] : this.data.applyingList; //历史
        applyHistoryList = applyHistoryList.concat(res.data.list)
        if (res.data.list.length > 0) {
          that.setData({
            applyHistoryRefresh: true
          })
        } else {
          that.setData({
            applyHistoryRefresh: false
          })
        }

        that.setData({
          applyHistoryPagenum: pagenum,
          applyHistoryList: applyHistoryList,
        })
      }
      wx.stopPullDownRefresh()
    }).catch(error => {
    })
  },

  //添加
  add() {
    app.globalData.goToPage("../addAssociation/addAssociation")
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.table === 1) {
      that._request(0, 1)

    } else {
      that._request(1, 1)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.table === 1) {
      if (this.data.applyRefresh) {
        that._request(0, this.data.applyPagenum+1)
      }
    } else {
      if (this.data.applyHistoryRefresh) {
        that._request(1, this.data.applyHistoryPagenum + 1)
      }

    }
  },

})