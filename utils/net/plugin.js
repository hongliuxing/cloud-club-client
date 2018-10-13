/**
 * 所有的原始请求都是插件
 */
import * as urls from './urls.js';

let timeout_count = 0;
let retry = 5;
let retry_msec = 300;

// const appid = "wx33cfb92cf676aa59";
// const appsecret = "87ccbe8283dae7dbc429a5da8f4ed408";

/**
 * 微信 - getUserInfo
 * 没意义
 */
const wxUserinfo = (loginRes) => new Promise((resolve, reject) => {
    wx.getUserInfo({
        withCredentials: true,
        success: function (userRes){
            resolve({ loginRes, userRes});
        },
        fail: reject
    })
});

/**
 * 微信 - 登录方法
 */
const wxLogin = () => new Promise((resolve, reject) => {
    wx.login({
        timeout: (2 * 24 * 60 * 60 * 1000), // 超时时间为2天, 支持版本 >= 1.9.9
        success: function (loginRes) {
            resolve({ loginRes });
        },
        fail: reject
    })
});

/**
 * 应用服务器 - 登录方法
 */
const appLogin = ({ loginCode }) => new Promise((resolve, reject) => {
    /**
     * 应用服务器登陆时传递的数据包括:
     * appid: 应用标识
     * loginCode: wx.login的res中获取的code
     */
    wx.request({
        url: urls.LOGIN,
        data: {
            appid: 'wxf22545deb852c577',
            loginCode
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res){
            // 登录成功后, 缓存token
            if (!res || res.err) return reject(res && res.err);
            // console.log(res);
            resolve(res);
        },
        fail: reject
    })
});

/**
 * 登录方法: 0.2
 * 替换原有的登录方式, 使用鉴权后的 getUserInfo
 */
export const login = () => new Promise((resolve, reject) => {
    // 登录之后, 将session_key交给getUserInfo进行解密
    wxLogin()
    .then(({ loginRes }) => {
        // 登录成功
        return appLogin({
            loginCode: loginRes.code
        });
    })
    .then( appLoginRes => {
        // 发送给登录服务器的登录结果
        console.log('appLogin success:', appLoginRes);
        const loginer = appLoginRes.data.info;
        wx.setStorageSync("loginer", loginer);
        resolve( loginer );
    })
    .catch(err => {
        // 登录失败
        console.log('getUserInfo fail:', err);
        reject({err});
    });
});

/**
 * 登陆专用
 */
// export const login = () => new Promise((resolve, reject) => {
//     wx.login({
//         success: function (res) {
//             wx.request({
//                 url: urls.LOGIN,
//                 data: {
//                     // appid, appsecret, 
//                     loginCode: res.code
//                 },
//                 method: 'POST',
//                 dataType: 'json',
//                 responseType: 'text',
//                 success: function (res) {
//                     // 登录成功后会获取换取登录态所需的code
//                     console.log("login: ", res);
//                     if (!res || res.err) return reject(res.err || 'res is null');
//                     const loginer = res.data.info;
//                     wx.setStorageSync("loginer", loginer);
//                     resolve(loginer);
//                 },
//                 fail: reject
//             })// request end ...
//         },
//         fail: reject
//     })
// });

/**
 * 检查请求中是否有正常的登陆状态
 */
const checkRequest = (res, verifyLogin) => {
    if (!verifyLogin) return Promise.resolve({ err: null, data: res.data });
    const err = res.data.err;
    if (!err) return Promise.resolve({ err: null, data: res.data });
    const pluginArr = [];
    if (err.errCode == 1001 || err.errCode == 1002 || err.errCode == 1003)
        pluginArr.push(login());
    return ~~pluginArr === 0 ? Promise.all(pluginArr) : Promise.reject({ err: err.errCode, data: res.data });
}
/**
 * 统一请求
 */
const ajax = function ajax({ url, method, header, data, verifyLogin = true }) {

    return new Promise((resolve, reject) => {
        wx.request({
            url, data, header, method,
            dataType: 'json',
            responseType: 'text',
            success: function (res) {
                checkRequest(res, verifyLogin).then(result => {
                    // Array is Promise.all(iterator)
                    if (Array.isArray(result)) {
                        if (timeout_count > retry){
                            return reject({err: 505, msg: 'request login timeout: [retry: 5]!'});
                        }
                        // 重试次数自增
                        timeout_count++;
                        header = { "x-access-token": wx.getStorageSync('loginer').token };
                        return resolve(ajax({ url, method, header, data }));
                    }
                    resolve(result);
                }).catch(err => {
                    reject(err);
                })
            },
            fail: function (err) {
                reject(err);
            }
        })
    })
}

/**
 * 验证是否登录(缓存中是否有loginer对象)
 */
const checkLogin = () => new Promise((resolve, reject) => {
    timeout_count = 0;
    if (!wx.getStorageSync('loginer')){
        login().then( loginRes => {
            resolve(loginRes);
        } ).catch(err => {
            reject(err);
        });
    }else{
        resolve('logined!');
    }
});

/**
 * 统一Post请求
 */
export const doPost = ({ url, header = {}, data, verifyLogin }) => new Promise((resolve, reject) => {
    // if (!header || !header["x-access-token"]) header = { "x-access-token": "errToken" };
    checkLogin().then( checkResult => {
        header = Object.assign({ "x-access-token": wx.getStorageSync('loginer').token }, header);
        return ajax({ url, method: "POST", header, data, verifyLogin });
    } )
    .then(commonRes => {
        resolve(commonRes);
    })
    .catch(err => {
        reject(err);
    });
    
});
/**
 * 统一Get请求
 */
export const doGet = ({ url, header = {}, data, verifyLogin }) => new Promise((resolve, reject) => {
    // if (!header || !header["x-access-token"]) header = { "x-access-token": "errToken" };
    checkLogin().then(checkResult => {
        header = Object.assign({ "x-access-token": wx.getStorageSync('loginer').token }, header);
        return ajax({ url, method: "GET", header, data, verifyLogin });
    })
    .then(commonRes => {
        resolve(commonRes);
    })
    .catch(err => {
        reject(err);
    });

});