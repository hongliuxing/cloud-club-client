// component/TorchButton/TorchButton.js
/**
 * 用于显示火把的按钮
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        torchNum: {
            type: Number, value: false,
            observer: function (newVal, oldVal, changedPath) {
                console.log('【torchNum】 ::::::', newVal);
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        
    },
    /**
     * 加载
     */
    ready() {
        // this.reflush();
    },

    /**
     * 组件的方法列表
     */
    methods: {
        tips() {
            wx.showToast({
                title: '点击活动左下角的小火焰为喜欢的社团打 Call 哦!',
                icon: 'none',
                duration: 1500,
                mask: true
            })
        }

        //
    }
})