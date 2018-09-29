// component/TopChannel/TopChannel.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 标签按钮数组
        // el：title(标题)，btype（点击类型：list、url、event），value（点击值）
        btns: {
            type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: [],
            observer: function (newVal, oldVal, changedPath) {
                // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
                // 通常 newVal 就是新设置的数据， oldVal 是旧数据
                // console.log('[newVal] topChannel btns: ', newVal);
                // console.log('[oldVal] topChannel btns: ', oldVal);
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },
    /**
     * 页面加载事件
     */
    created() {},
    /**
     * 页面加载事件
     */
    attached() {},
    /**
     * 页面加载事件
     */
    ready() {
        console.log('data: ', this.data);
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})