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