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

    item:{
      type:Object,
      value:{}
    },
    //下标
    index:Number,
    userId:String

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
    //查看
    onInfo(e){
      let that = this;
      this.triggerEvent('lookInfo', { index:that.data.index,id:e.currentTarget.dataset.id })
    },
    //编辑
    onEdit(e) {
      let that = this;
      this.triggerEvent('edit', { index: that.data.index, id: e.currentTarget.dataset.id })
    },
  }
})
