// component/TopChannel/child/Button.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      btnConf: Object,
      btnLen: Number
    //   title: String,
    //   btype: String,
    //   value: String
  },

  /**
   * 组件的初始数据
   */
  data: {
      styles: {}
  },
  /**
   * 页面加载事件
   */
  ready(){
      let { btnLen } = this.data;
      if(typeof btnLen == 'number'){
          this.setData({'styles.width': (100/btnLen)+'%'});
          console.log('data:', JSON.stringify(this.data.styles));
      }
  },

  /**
   * 组件的方法列表
   */
  methods: {
      // 按钮单击事件
      onTap(e){
          console.log('top btn click: ', this.data);
      },
      // 下拉事件
      bindPickerChange(e){
          this.data.btnConf.value.bindchange(e);
      }
  }
})
