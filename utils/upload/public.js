import * as Actions from "../net/Actions.js";
import * as URLs from "../net/urls.js";

export const goToPage = (url) => {
  wx.navigateTo({
    url: url,
  })
}

export const goBack = ({
  title="保存成功"
}) => {
  toast(title)
  setTimeout(function() {
    wx.navigateBack({
      delta: 1
    })
  }, 500)

}

export const toast = (title, icon = "none") => {
  wx.showToast({
    title: title,
    icon: icon,
  })
}

//选择省市打开动画
export const onStartAnimation = (that,one=300,two=0) => {
  var animation = wx.createAnimation({
    duration: 150,
    timingFunction: 'linear'
  })
  that.animation = animation
  animation.translateY(one).step()
  that.setData({
    animationData: animation.export(),
  })
  setTimeout(function() {
    animation.translateY(two).step()
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
export const onCloseAnimation = (that, one = 0, two = 300) => {
  var animation = wx.createAnimation({
    duration: 150,
    timingFunction: 'linear'
  })
  that.animation = animation
  animation.translateY(one).step()
  that.setData({
    animationData: animation.export(),
  })
  setTimeout(function() {
    animation.translateY(two).step()
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
  setTimeout(function() {
    that.setData({
      animationMask: that.animationMask.export(),
      visable: false
    });
  }, 150)
}



//查询省份城市
export const searchProvine = (that, provinceCode, cityCode) => {
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
      }).catch(error => {})
      break;
    }
  }
}




export const getNextMonth = (date) =>{
  var arr = date.split('-');
  var year = arr[0]; //获取当前日期的年份
  var month = arr[1]; //获取当前日期的月份
  var day = arr[2]; //获取当前日期的日
  var days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中的月的天数
  var year2 = year;
  var month2 = parseInt(month) + 1;
  if (month2 == 13) {
    year2 = parseInt(year2) + 1;
    month2 = 1;
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }

  var t2 = year2 + '-' + month2 + '-' + day2;
  return t2;
}