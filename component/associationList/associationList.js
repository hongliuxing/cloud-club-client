// component/associationList/associationList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageUrl:String,
    status:{
      type:Number,
      value:0
    },
    image:{
      type:Boolean,
      value:true
    }, 
    case:String,

    height:{
      type:Number,
      value: 140
    },
    name:String,
    time:String,
    istime:{
      type:Boolean,
      value:false,
    },
    //判断是不是加入社团或社团入驻(eg:false 社团入驻)
    admission:{
      type: Boolean,
      value:true
    },
    //社团入驻 false为申请状态,
    isBtn:{
      type: Boolean,
      value: false
    },
    //判断是不是历史channel
    history:{
      type: Boolean,
      valse:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
