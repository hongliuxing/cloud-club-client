// component/inputItem/inputItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name:String,
    diabled:{
      type:Boolean,
      value:true
    },
    right:{
      type:Boolean,
      value:true
    },
    spac:{
      type:Number,
      value:8
    },
    title:String,
    value:String,
    height:{
      type:Number,
      value:30
    },
    back:{
      type:String,
      value:'#fff'
    },
    plac:String,
    go:{
      type:Boolean,
      value:true
    },
    typeAlign:{
      type: String,
      value: "center"
    }
  },
  externalClasses: ["_input-class","title_class"],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onchange(e){
      let resData = {
        value:e.detail.value,
        name:e.target.dataset.name
      }
      this.triggerEvent('change', resData)
    },
    onclick(){
      this.triggerEvent('click')
    }
  }
})
