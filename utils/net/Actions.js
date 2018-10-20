import * as plugin from "./plugin.js";
import * as URLs from './urls.js';

// 原始的请求对象
// 其他的请求暂不封装, 直接调用 doGet 或 doPost 吧
// 之后再考虑重构成模型
export const login = plugin.login;
export const doPost = plugin.doPost;
export const doGet = plugin.doGet;

/**
 * 上传通用工具
 * 涵盖签名获取 -> 上传至OSS
 */
const uploadUtil = (url, filepath) => new Promise((resolve, reject) => {
    if (!filepath || filepath.length < 9) {
        return wx.showModal({
            title: '图片错误',
            content: '请重试',
            showCancel: false,
        });
    }
    // filepath is not null
    doGet({
        url,
        data: { filepath: filepath },
        // verifyLogin: false // 是否验证登陆的参数，临时用
    }).then(result => {
        // 获得签名成功后执行上传任务
        console.log('上传接口结果：', result);
        const { url, key, policy, OSSAccessKeyId, signature } = result.data.formData;
        return uploadToAlioss({
            filepath, url, key, policy, OSSAccessKeyId, signature
        });
    }).then(uploadRes => {
        // 上传结果
        if (uploadRes.err) return reject({ err: new Error('上传图片错误', uploadRes) });
        resolve(uploadRes);
    }).catch(err => {
        console.log('上传接口错误：', err);
        reject(err);
    }); // doGet
});

/**
 * 代码不要太长，所以xcx上传部分独立出来了
 */
const uploadToAlioss = ({ filepath, url, key, policy, OSSAccessKeyId, signature }) => new Promise((resolve, reject) => {

  // 调用小程序的上传接口
  wx.uploadFile({
    url: url,
    filePath: filepath, // 这个filePath是通过chooseImage选择到的那个路径
    name: 'file', //必须填file
    // 这里必须这么填
    formData: {
      'key': key,
      'policy': policy,
      'OSSAccessKeyId': OSSAccessKeyId,
      'signature': signature,
      'success_action_status': '200',
    },
    success: function (res) {
      if (res.statusCode != 200) {
        return reject(new Error('网络错误:', res));
      }
      console.log('上传图片成功', res)
      resolve(Object.assign({ pic: url + '/' + key }, res));
    },
    fail: function (err) {
      // err.wxaddinfo = aliyunServerURL;
      reject(new Error('上传错误:', err));
    },
  }) // wx.uploadFile
});

//压缩图片
// const handleImage = (_this,url)=>new Promise((resolve,reject)=>{
//       wx.getImageInfo({
//         src: photo.tempFilePaths[0],
//         success: function (res) {
//           var ctx = wx.createCanvasContext('photo_canvas');
//           var ratio = 2;
//           var canvasWidth = res.width
//           var canvasHeight = res.height;
//           // 保证宽高均在200以内
//           while (canvasWidth > 200 || canvasHeight > 200) {
//             //比例取整
//             canvasWidth = Math.trunc(res.width / ratio)
//             canvasHeight = Math.trunc(res.height / ratio)
//             ratio++;
//           }
//           _this.setData({
//             canvasWidth: canvasWidth,
//             canvasHeight: canvasHeight
//           })//设置canvas尺寸
//           ctx.drawImage(photo.tempFilePaths[0], 0, 0, canvasWidth, canvasHeight)
//           ctx.draw()
//           //下载canvas图片
//           setTimeout(function () {
//             wx.canvasToTempFilePath({
//               canvasId: 'photo_canvas',
//               success: function (res) {
//                 console.log(res.tempFilePath)
//               },
//               fail: function (error) {
//                 console.log(error)
//               }
//             })
//           }, 100)
//         },
//         fail: function (error) {
//           console.log(error)
//         }
//       })
// })



// 对外暴露的上传通用事件
export const uploadSign = {
  // 手持学生证或身份证上传签名
  pid: (filepath) => uploadUtil(URLs.UPLOAD_CLUB_PID, filepath),
  // 社团合影上传签名
  clubApply: (filepath) => uploadUtil(URLs.UPLOAD_CLUBAPPLY, filepath),
  // 社团logo上传签名
  clubLogo: (clubid, filepath) => uploadUtil(URLs.UPLOAD_CLUB_LOGO(clubid), filepath),
  // 社团背景图上传签名
  clubBgimg: (clubid, filepath) => uploadUtil(URLs.UPLOAD_CLUB_BGIMG(clubid), filepath),
  // 社团活动图的签名
  activityPic: (filepath) => uploadUtil(URLs.UPLOAD_CLUB_ACTIVITY_PIC, filepath)
};