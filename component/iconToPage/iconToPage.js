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
    right:{
      type:Boolean,
      value:true
    },
    top: {
      type: Boolean,
      value: true
    },
    bottom: {
      type: Boolean,
      value: true
    },
    src:String,
    title:String,
    value:String,
    valueColor: String,
    name:String,
    url:String,
    index:Number,

    item:{
      type:Object,
      value:{}
    }
  },
  externalClasses: ["icon-image", "title-name","value-class"],

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
      let that = this;
      this.triggerEvent('onclick', { url: that.data.url, index: that.data.index, item: that.data.item})
    }
  }
})
