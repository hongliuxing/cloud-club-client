// component/iconToPage/iconToPage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height:{
      type:Number,
      value:100
    },
    src:String,
    title:String,
    value:String,
    name:String,
    url:String
  },
  externalClasses: ["icon-image","title-name"],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _click(e){
      this.triggerEvent('onclick',{url:e.target.dataset.url})
    }
  }
})
