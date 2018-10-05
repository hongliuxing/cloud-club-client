/**
 * 代码不要太长，所以xcx上传部分独立出来了
 */
const doUpload = ({ filePath, url, key, policy, OSSAccessKeyId, signature }) => new Promise((resolve, reject) => {
    // 调用小程序的上传接口
    wx.uploadFile({
        url: url,
        filePath: filePath, // 这个filePath是通过chooseImage选择到的那个路径
        name: 'file', //必须填file
        // 这里必须这么填
        formData: {
            'key': key,
            'policy': policy,
            'OSSAccessKeyId': OSSAccessKeyId,
            'signature': signature,
            'success_action_status': '200',
        },
        success: function(res) {
            if (res.statusCode != 200) {
                return reject(new Error('网络错误:', res));
            }
            console.log('上传图片成功', res)
            resolve(Object.assign({ pic: url+'/'+key}, res));
        },
        fail: function(err) {
            // err.wxaddinfo = aliyunServerURL;
            reject(new Error('上传错误:', err));
        },
    }) // wx.uploadFile
});

/**
 * 统一上传文件函数
 * filepath: 微信选择的上传图片地址
 * singAPI: 用于获取上传签名的函数（这个函数请自行编写）
 */
const uploadFile = (filePath, signAPI) => new Promise((resolve, reject) => {
    if (!filePath || filePath.length < 9) {
        return wx.showModal({
            title: '图片错误',
            content: '请重试',
            showCancel: false,
        });
    }
    if (typeof signAPI !== 'function'){
        return wx.showModal({
            title: '未添加签名函数',
            content: '请重试',
            showCancel: false,
        });
    }

    console.log('开始上传图片…');
    // 开始进行签名获取
    signAPI(filePath).then(result => {
        // 成功获取签名
        console.log('ali-oss 请求上传签名： ', result);
        if (result.err) return reject({ err: new Error('获取签名错误', result)});
        // 签名的内容在这里，展开是为了让大家知道在这里
        const { url, key, policy, OSSAccessKeyId, signature } = result.data.formData;
        // 这里的 doUpload， 是上边封装的那个xcx的上传接口，他也会返回一个Promise，因此继续then
        return doUpload({
            filePath, url, key, policy, OSSAccessKeyId, signature
        });
    }).then(uploadRes => {
        // 上传结果
        if (uploadRes.err) return reject({ err: new Error('上传图片错误', uploadRes) });
        resolve(uploadRes);
    }).catch(err => {
        reject({err});
    });
});



export default uploadFile;