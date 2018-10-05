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
    // 这是获取云社团上传签名的方法
    headpic: (filepath) => new Promise((resolve, reject) => {
        // filepath is not null
        doGet({ 
            //url: 'http://luv-ui.com:58888/upload/sheu/headpic', 
            url: 'http://luv-ui.com:58888/upload/wm/client/headpic',
            // url: 'http://127.0.0.1:58888/upload/wm/client/headpic',
            // url: 'http://127.0.0.1:58888/upload/sheu/headpic',
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