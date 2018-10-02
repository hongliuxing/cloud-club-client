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