import * as plugin from "./plugin.js";
import * as URLs from './urls.js';

// 原始的请求对象
// 其他的请求暂不封装, 直接调用 doGet 或 doPost 吧
// 之后再考虑重构成模型
export const login = plugin.login;
export const doPost = plugin.doPost;
export const doGet = plugin.doGet;

// 2. 上传相关
const upload = (url, filepath) => new Promise((resolve, reject) => {
    // filepath is not null
    doGet({
        url,
        data: { filepath: filepath },
        // verifyLogin: false // 是否验证登陆的参数，临时用
    }).then(result => {
        console.log('上传接口结果：', result);
        resolve(result);
    }).catch(err => {
        console.log('上传接口错误：', err);
        reject(err);
    }); // doGet
});

// 上传通用事件
export const uploadSign = {
    // 手持学生证或身份证上传签名
    pid: (filepath) => upload(URLs.UPLOAD_CLUB_PID, filepath),
    // 社团合影上传签名
    clubApply: (filepath) => upload(URLs.UPLOAD_CLUBAPPLY, filepath),
    // 社团logo上传签名
    clubLogo: (clubid, filepath) => upload(URLs.UPLOAD_CLUB_LOGO(clubid), filepath),
    // 社团背景图上传签名
    clubBgimg: (clubid, filepath) => upload(URLs.UPLOAD_CLUB_BGIMG(clubid), filepath),
    // 社团活动图的签名
    activityPic: (filepath) => upload(URLs.UPLOAD_CLUB_ACTIVITY_PIC, filepath)
};