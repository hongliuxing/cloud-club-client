// component/TopChannel/child/Button.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      title: String,
      btype: String,
      value: String
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
      // 按钮单击事件
      onTap(e){
          console.log('top btn click: ', this.data.title);
      }
  }
})
