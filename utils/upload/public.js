import * as Actions from "../net/Actions.js";
import * as URLs from "../net/urls.js";

export const goToPage = (url)=>{
   wx.navigateTo({
     url: url,
   })
}

export const toast = (title, icon="none")=>{
  wx.showToast({
    title: title,
    icon: icon,
  })
}

//选择省市打开动画
export const onStartAnimation = (that) =>{
  var animation = wx.createAnimation({
    duration: 150,
    timingFunction: 'linear'
  })
  that.animation = animation
  animation.translateY(300).step()
  that.setData({
    animationData: animation.export(),
  })
  setTimeout(function () {
    animation.translateY(0).step()
    that.setData({
      animationData: animation.export()
    })
  }, 0)
  var animation2 = wx.createAnimation({
    timingFunction: 'linear'
  })
  // 遮罩渐变动画
  var animationMask = wx.createAnimation({
    duration: 150,
    timingFunction: 'linear',
  });
  that.animationMask = animationMask;
  animationMask.opacity(1).step();
  that.setData({
    animationMask: that.animationMask.export(),
  });
}



//选择省市关闭动画
export const onCloseAnimation = (that)=> {
  var animation = wx.createAnimation({
    duration: 150,
    timingFunction: 'linear'
  })
  that.animation = animation
  animation.translateY(0).step()
  that.setData({
    animationData: animation.export(),
  })
  setTimeout(function () {
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export()
    })
  }, 0)
  // 遮罩渐变动画
  var animationMask = wx.createAnimation({
    duration: 150,
    timingFunction: 'linear',
  });
  that.animationMask = animationMask;
  that.animationMask.opacity(0).step();
  setTimeout(function () {
    that.setData({
      animationMask: that.animationMask.export(),
      visable: false
    });
  }, 150)
}



//查询省份城市
export const searchProvine = (that, provinceCode, cityCode) =>{
  let proviceList = wx.getStorageSync("province");
  for (let i = 0; i < proviceList.length; i++) {
    if (provinceCode == proviceList[i].code) {
      Actions.doGet({
        url: URLs.SCHOOL_CITY_LIST,
        data: {
          provincecode: provinceCode
        }
      }).then(res => {
        for (let a = 0; a < res.data.list.length; a++) {
          if (res.data.list[a].code == cityCode) {
            that.setData({
              proCity: proviceList[i].name + " / " + res.data.list[a].name,
            })
            break;
          }
        }
      }).catch(error => { })
      break;
    }
  }
}