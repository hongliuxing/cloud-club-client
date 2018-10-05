## 上传步骤说明

### 1. 你的页面（page.js）

``` javascript
// 这个是封装的上传文件通用模块
// 你甚至不用修改，不用管这个是什么，知道在哪导进来就行
import uploadFile from '../../utils/upload/support.js';
// 这里获取的是一个上传签名的函数
// 为了更少步骤，这里选择通用 “上传模块 + 上传函数” 的组装风格
import { uploadSign } from '../../utils/net/Actions.js';
Page({

  /**
   * 测试上传接口
   * 参考位置： pages/test/upload.js
   */
  testUpload(e){
        // 选择图片先
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
                console.log('选择图片成功： ', res.tempFiles)
                /**
                 * upload/support.js提供的上传封装
                 * 参数有两个：
                 * filepath: 微信选择的上传图片地址
                 * singAPI: 用于获取上传签名的函数（这个函数请自行编写）
                 */
                uploadFile(res.tempFiles[0].path, uploadSign.headpic)
                    .then((uploadRes) => {
                        console.log('上传结果：：：', uploadRes);
                    })
                    .catch(err => {
                        console.log('上传错误：：', err);
                    });
            },
            fail: function(res) {},
            complete: function(res) {},
        })
  }

});

```

### 2. 编写一个上传签名接口请求函数

``` javascript

/**
 * 上传获取签名的请求调用
 * 位置： /utils/net/Action.js
 * 主要是 doGet 方法，封装成你自己的就行
 * url 和 data.filepath 是必要参数
 */
export const uploadSign = {
    // 这是获取云社团上传签名的方法
    headpic: (filepath) => new Promise((resolve, reject) => {
        // filepath is not null
        doGet({ 
            url: 'http://luv-ui.com:58888/upload/sheu/headpic', 
            data: { filepath: filepath },
            verifyLogin: false // 是否验证登陆的参数，临时用
        }).then(result => {
            console.log('上传接口结果：', result);
            resolve(result);
        }).catch(err => {
            console.log('上传接口错误：', err);
            reject(err);
        }); // doGet
    })
};

```