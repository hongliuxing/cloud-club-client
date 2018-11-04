import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlSchool: "../../mine/editSchool/editSchool",
    myAssociation: "../../mine/myAssociation/myAssociation",
    luckExplain: "../../mine/luckExplain/luckExplain",
    sportExplain: "../../mine/sportExplain/sportExplain",
    torchExplain: "../explain/torch/torch",
    info: {},
    school: "未设置",
    status: null, //学校状态
    telephone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    wx.showLoading({
      title: '正在组装社团...',
      mask: true
    });
    that._request()
  },

  //请求
  _request() {
    // Actions.doGet({
    //   url: URLs.USER_PANEL_INFO,
    //   data: {}
    // }).then(res => {
    //  wx.hideLoading()

    let currInfo = wx.getStorageSync("userInfo");
    if (!currInfo) {
      wx.hideLoading();
      return;
    }
    let status = currInfo.school_struts;
    let name = "";
    if (status == 1) {
      name = "已通过"
    } else if (status == 0) {
      name = "申请中"
    } else if (status == -1) {
      name = "未通过"
    } else {
      name = "未设置"
    }

    that.setData({
      info: currInfo,
      school: name,
      status: status || null,
      canPullTorch: currInfo.can_pull_torch,
      telephone: currInfo.telephone
    })
    wx.hideLoading();

    wx.setStorageSync("mineRefresh", null)
    //   wx.setStorageSync("userInfo", res.data.info)
    // }).catch(err => {
    //   console.log('我的社团 err: ', err);
    // });
  },
  //修改信息页面
  goToUser() {
    app.globalData.goToPage("../../mine/person/person?userinfo=" + JSON.stringify(this.data.info))
  },
  //页面跳转
  goTo(e) {
    if (this.data.myAssociation == e.detail.url) {
      if (this.data.telephone == "" || this.data.telephone == null) {
        app.globalData.toast("请先绑定手机号")
        return
      }
      if (this.data.status != 1) {
        app.globalData.toast("学校信息未通过")
        return
      }
    }
    if (this.data.urlSchool == e.detail.url) {
      if (this.data.telephone == "" || this.data.telephone == null) {
        app.globalData.toast("请先绑定手机号")
        return
      }
    }
    app.globalData.goToPage(e.detail.url)
  },
  /**
   * 获取火把的事件
   */
  onPullTorch(e) {
    let that = this;
    console.log('获取火把:: ', e);
    // 首先判断是否可以获取火把
    let uinfo = wx.getStorageSync('userInfo');
    // 不能重复领取了
    if (uinfo['can_pull_torch'] !== 1) {
      // 不能领取
      return that.onToast('不能重复领取');
    }
    // 如果当前火把还有剩余, 提醒用户领取火把不能累积, 建议先用完再领今日份
    if (uinfo['current_torch'] > 0) {
      wx.showModal({
        title: '提示',
        content: '火把尚未用完, 现在领取会覆盖原有数量!',
        showCancel: true,
        cancelText: '先去使用',
        // cancelColor: '',
        confirmText: '现在就领',
        // confirmColor: '',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.pullTorch();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      // 无障碍领取火把
      that.pullTorch();
    }


  },
  /**
   * 领取火把流程
   */
  pullTorch() {
    let that = this;
    let uinfo = wx.getStorageSync('userInfo');
    // 否则进入领取环节
    wx.showLoading({
      title: '正在传递火把...',
      mask: true
    });
    // 获取火把的过程
    Actions.doPost({
      url: URLs.TORCH_PULL
    }).then(res => {
      wx.hideLoading();
      if (res.data.err) {
        console.log('获取火把错误: ', res);
        return that.onToast('服务器繁忙');
      }
      // 变更领取状态 及 火把数量
      let torch_count = res.data.info.result;
      if (torch_count === -1) {
        return that.onToast('请先设置用户信息');
      } else if (torch_count === 0) {
        return that.onToast('今天领过啦');
      } else if (torch_count > 0) {
        that.onToast('领到 ' + torch_count + '个火把!');
        uinfo['can_pull_torch'] = 0;
        uinfo['current_torch'] = torch_count;
        wx.setStorageSync('userInfo', uinfo);
        that.setData({
          canPullTorch: 0,
          info: uinfo
        });
      }

    }).catch(err => {
      wx.hideLoading();
      console.log('获取火把异常: ', err);
    });
  },

  onToast(title) {
    return wx.showToast({
      title: title,
      image: '/images/page/face-fail.png',
      duration: 1500,
      mask: true
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (wx.getStorageSync("mineRefresh")) {
      wx.showLoading({
        title: '正在组装社团...',
        mask: true
      });
      that._request()
    }

  },
  /**
   * 
   */
  test() {
    // wx.chooseImage({
    //     count: 0,
    //     sizeType: ["compressed"],
    //     sourceType: ['album', 'camera'],
    //     success: function(res) {
    //         console.log('选择图片:', res);
    //         Actions.uploadSign.activityPic(res.tempFilePaths[0])
    //             .then((uploadRes) => {
    //                 console.log('ActivityPic:', uploadRes);
    //                 if (uploadRes.errMsg == "uploadFile:ok") {
    //                     that.setData({
    //                         cert_url: uploadRes.pic
    //                     })
    //                 }
    //             })
    //             .catch(err => {
    //                 console.log('上传错误：：', err);
    //             });
    //     }
    // })
  }

})