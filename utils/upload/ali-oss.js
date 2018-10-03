

const doUpload = ({ filePath, url, key, policy, OSSAccessKeyId, signature }) => new Promise((resolve, reject) => {
    wx.uploadFile({
        url: url,
        filePath: filePath,
        name: 'file', //必须填file
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
    //uploadSign.headpic
    signAPI(filePath).then(result => {
        console.log('ali-oss 请求上传签名： ', result);
        if (result.err) return reject({ err: new Error('获取签名错误', result)});
        const { url, key, policy, OSSAccessKeyId, signature } = result.data.formData;
        return doUpload({
            filePath, url, key, policy, OSSAccessKeyId, signature
        });
    }).then(uploadRes => {
        if (uploadRes.err) return reject({ err: new Error('上传图片错误', uploadRes) });
        resolve(uploadRes);
    }).catch(err => {
        reject({err});
    });
});



export default uploadFile;