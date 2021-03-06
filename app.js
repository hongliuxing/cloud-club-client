import * as Actions from "./utils/net/Actions.js";
import * as URLs from "./utils/net/urls.js";
import { goToPage, toast, goBack} from "./utils/upload/public.js";

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 临时登录
    // if (!wx.getStorageSync("loginer")){
    //     Actions.login().then(result => {
    //         console.log('login: ', result);
    //     })
    // }

    // Actions.doPost({ 
    //     url: 'http://127.0.0.1:7001/test/testPost',
    //     data: {
    //         struts: 0,
    //         pagenum:1
    //     }
    // }).then(res => {
    //     console.log('CLUBMASTER_BUILD_APPLY_LIST: ', res);
    // }).catch(err => {
    //     console.log('err: ', err);
    // });

    // Actions.doGet({
    //     url: 'http://127.0.0.1:7001/test/testGet',
    //     data: {
    //         struts: 0,
    //         pagenum:1
    //     }
    // }).then(res => {
    //     console.log('CLUBMASTER_BUILD_APPLY_LIST: ', res);
    // }).catch(err => {
    //     console.log('err: ', err);
    // });

    // wx.getLocation({
    //     type: "gcj02",
    //     success: function(res){
    //         console.log(`latitude:  ${res.latitude}`);
    //         console.log(`longitude:  ${res.longitude}`);
    //     }
    // });

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    goToPage: goToPage,
    toast: toast,
    goBack: goBack
  }
})