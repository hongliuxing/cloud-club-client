// component/TopChannel/child/Button.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      btnConf: Object,
      btnLen: Number,
      btnIndex: Number,
      btnWidth: {
          type: String, value: 'auto',
          observer: function (newVal, oldVal, changedPath) {
            //   console.log('styles.width: ', this.data.btnWidth);
              this.setData({ 'styles.width': this.data.btnWidth });
          }
      },
      selected: {
          // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
          type: Boolean, value: false,
          observer: function (newVal, oldVal, changedPath) {
              // console.log('selected change: [old: ' + oldVal +'] [new: '+newVal+']');
          }
      }
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
    //   let { btnLen } = this.data;
    //   if(typeof btnLen == 'number'){
    //       this.setData({'styles.width': (100/btnLen)+'%'});
    //   }
  },

  /**
   * 组件的方法列表
   */
  methods: {
      // 按钮单击事件
      onTap(e){
          // 触发父组件的【频道改变事件】，并传递参数
          this.triggerEvent('ChannelChange', this.data.btnIndex, { bubbles: true });
          // 触发调用者事件
          let tap = this.data.btnConf.value;
          typeof tap == 'function' && tap(e);
      },
      // 下拉事件
      bindPickerChange(e){
          this.data.btnConf.value.bindchange(e, this);
      }
  }
})
