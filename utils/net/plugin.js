import * as urls from './urls.js';

const appid = "wx33cfb92cf676aa59";
const appsecret = "87ccbe8283dae7dbc429a5da8f4ed408";

export const login = () => new Promise((resolve, reject) => {
  wx.login({
    success: function (res) {
      wx.request({
        url: urls.LOGIN,
        data: {
          appid, appsecret, loginCode: res.code
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log("login: ", res);
          if (!res || res.err)
            return reject(res.err || 'res is null');
          const token = res.data.data.token || res.data.data;
          wx.setStorageSync("token", token);
          resolve(token);
        },
        fail: reject
      })// request end ...
    },
    fail: reject
  })
});

const checkRequest = (res) => {
  const errCode = res.data.err.errCode;
  if (errCode === 0) return Promise.resolve({ err: null, data: res.data});
  const pluginArr = [];
  if (errCode == 1001 || errCode == 1002 || errCode == 1003)
    pluginArr.push(login());
  return ~~pluginArr === 0 ? Promise.all(pluginArr) : Promise.reject({ err: errCode, data: res.data});
}

const ajax = function ajax({ url, method, header, data, success, fail }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url, data, header, method,
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        checkRequest(res).then( result => {
          // Array is Promise.all(iterator)
          if (Array.isArray(result)){ 
            header = { "x-access-token": wx.getStorageSync('token') };
            return resolve(ajax({ url, method, header, data, success, fail }) );
          }
          resolve(result);
        }).catch( err => {
          reject(err);
        })
      },
      fail
    })
  })
}

export const doPost = ({ url, header = { "x-access-token": wx.getStorageSync('token')}, data, success, fail}) => {
  if (!header || !header["x-access-token"]) header = { "x-access-token": "errToken"};
  return ajax({ url, method: "POST", header, data, success, fail });
}

export const doGet = ({ url, header, data, success, fail }) => {
  return ajax({ url, method: "GET", header, data, success, fail });
}