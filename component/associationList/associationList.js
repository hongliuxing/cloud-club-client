// component/associationList/associationList.js
Component({
  /**
   * 组件的属性列表
   * 
   * admission:**(主要判断哪个用个那个组件渲染，false为社团入驻)
   */
  properties: {
    item:{
      type:Object,
      value:{}
    },
    index:Number,
    //状态判断
    status:{
      type:Number,
      value:0
    },
    //拒绝原因
    case:String,
    //控制图片高度
    height:{
      type:Number,
      value: 140
    },
    //判断显示时间还是社团成员(仅在社团申请)
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
    },
    //判断有没有下边线
    bottom:{
      type: Boolean,
      valse: false
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

    //点击跳转详情
    onClick(e){
      let data = {};
      if (this.data.isBtn){
        data = {
          id: e.currentTarget.dataset.id,
          isAttention: e.currentTarget.dataset.isAttention
        }
      }else{
        data = {
          id: e.currentTarget.dataset.clubid,
          isAttention: e.currentTarget.dataset.isAttention
        }
      }

      this.triggerEvent('click',data)
    },

    //点击申请
    onApply(e){
      let that = this;
      this.triggerEvent('apply', { child: e.target.dataset.childId, index: that.data.index })
    }
  }
})
