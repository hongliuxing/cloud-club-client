// component/activityList/activityList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //判断审核中还是新的活动(eg:true审核中)
    btn:{
      type:Boolean,
      value:true
    },
    //判断是不是作者
    isAuthor:{
      type:Boolean,
      value:true
    },

    //标题
    title:String,
    //时间
    createdAt:String,
    //拒绝理由
    checked_fail_reason:String,
    //作者
    author:String,
    //状态值
    struts:Number,
    //图片路径
    imageUrl:String

  },
  externalClasses: ["item-class"],
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
