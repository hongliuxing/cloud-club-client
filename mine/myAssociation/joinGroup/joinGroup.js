import * as Actions from "../../../utils/net/Actions.js";
import * as URLs from "../../../utils/net/urls.js";
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    table: 1,
    aa: 123,
    pagenum: 1,
    canapplyrefresh: true,
    canapplyList: [],
    applyList: [],
    applyrefresh: true,
    applyPagenum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 标签页频道组件
    that = this;
    let topBtns = [{
        title: "本校社团列表",
        btype: "event",
        value: (e) => this.Associations()
      },
      {
        title: "申请历史",
        btype: "event",
        value: (e) => this.applyHistory()
      }
    ];
    this.setData({
      topBtns: topBtns
    });
    that.canapplyList(1)
  },

  //本校社团
  Associations() {
    if (this.data.table === 1) {
      return
    } else {
      that.setData({
        table: 1
      })
    }
    if (that.data.canapplyList.length > 0) {
      return
    } else {
      that.canapplyList(1)
    }
    
  },

  //申请历史
  applyHistory() {
    if (this.data.table === 2) {
      return
    } else {
      that.setData({
        table: 2
      })
    }
    if (that.data.applyList.length > 0) {
      return
    } else {
      that.applyList(1)
    }

  },

  //可加入列表
  canapplyList(pageindex) {
    Actions.doGet({
      url: URLs.CLUB_SELF_CANAPPLY_LIST,
      data: {
        pagenum: pageindex
      }
    }).then(res => {
      if (pageindex == 1) {
        that.setData({
          canapplyList: res.data.list,
          canapplyrefresh: true,
          pagenum: pageindex
        })
      } else {
        let arr = this.data.canapplyList;
        if (res.data.list.length > 0) {
          arr = arr.concat(res.data.list)
          that.setData({
            canapplyList: arr,
            canapplyrefresh: true,
            pagenum: pageindex
          })
        } else {
          that.setData({
            canapplyList: arr,
            canapplyrefresh: false,
            pagenum: pageindex
          })
        }
      }
      wx.stopPullDownRefresh()
    }).catch(error => {})
  },


  //历史申请列表
  applyList(pageindex) {
    Actions.doGet({
      url: URLs.CLUB_SELF_APPLY_LIST,
      data: {
        pagenum: pageindex
      }
    }).then(res => {
      if (pageindex == 1) {
        that.setData({
          applyList: res.data.list,
          applyrefresh: true,
          applyPagenum: pageindex
        })
      } else {
        let arr = this.data.applyList;
        if (res.data.list.length > 0) {
          arr = arr.concat(res.data.list)
          that.setData({
            applyList: arr,
            applyrefresh: true,
            applyPagenum: pageindex
          })
        } else {
          that.setData({
            applyList: arr,
            applyrefresh: false,
            applyPagenum: pageindex
          })
        }
      }
      wx.stopPullDownRefresh()
    }).catch(error => {})
  },

  //跳转详情
  Goto(e) {
    let id = e.detail.id;
  },

  //申请入团
  onApply(e) {
    let id = e.detail.child;
    let index = e.detail.index;
    Actions.doPost({
      url: URLs.CLUB_SELF_JOIN,
      data: {
        clubid: id
      }
    }).then(res => {
      if (res.data) {
        let clun_id = res.data.info.club_id;
        if (clun_id == id) {
          let arr = that.data.canapplyList;
          arr[index].apply_struts = 0;
          that.setData({
            canapplyList: arr
          })
          app.globalData.toast("申请成功")
        }
      }

    }).catch(error => {})
  },

  onChange(e) {
    this.setData({
      k: e.detail.value
    })
  },

  onSearch() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

    if (that.data.table == 1) {

      that.canapplyList(1)

    } else {

      that.applyList(1)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (that.data.table == 1) {
      if (that.data.canapplyrefresh) {
        that.canapplyList(that.data.pagenum + 1)
      }
    } else {
      if (that.data.applyrefresh) {
        that.applyList(that.data.applyPagenum + 1)
      }
    }
  },

})