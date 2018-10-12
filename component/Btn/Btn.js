// component/Btn/Btn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height:{
      type:Number,
      value:100
    },
    back:{
      type:String,
      value:"#57d8d6"
    },
    value:String
  },
  externalClasses: ["btn-class"],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onclick(){
      this.triggerEvent('click')
    }
  }
})
