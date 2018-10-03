import * as plugin from "./plugin.js";

// 原始的请求对象
export const login = plugin.login;
export const doPost = plugin.doPost;
export const doGet = plugin.doGet;

// 其他请求事件处理
// 1. 活动相关
export const activity = {
    getActivityList: (clubId) => new Promise((resolve, reject) => {
        // if clubId is null, return all list
        
    })
};

// 2. 上传相关
export const uploadSign = {
    headpic: (filepath) => new Promise((resolve, reject) => {
        // filepath is not null
        doGet({ 
            url: 'http://127.0.0.1:8888/upload/sheu/headpic', 
            data: { filepath: filepath },
            verifyLogin: false
        }).then(result => {
            console.log('上传接口结果：', result);
            resolve(result);
        }).catch(err => {
            console.log('上传接口错误：', err);
            reject(err);
        }); // doGet
    })
};