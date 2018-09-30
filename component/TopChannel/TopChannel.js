// component/TopChannel/TopChannel.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 标签按钮数组
        // el：title(标题)，btype（点击类型：list、url、event），value（点击值）
        // 当btype是event时，value应当是一个触发点击时的函数
        // 当btype是url时，value应当是一个url页内跳转地址
        // 当btype是list时，value应当是一个 picker 对象（仅支持单列下拉）
        /**
         * {
         *   range: mode为 selector 或 multiSelector 时，range 有效
         *   rangeKey: 当 range 是一个 Object Array 时，通过 range-key 来指定 Object 中 key 的值作为选择器显示内容
         *   index: 默认索引位置
         *   bindchange: 下拉触发的函数
         * }
         */
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
        // let query = wx.createSelectorQuery()
        // query.select('.comp-top-channel').boundingClientRect()
        // query.exec(function (rect) {
        //     console.log('comp-top-channel: ', rect);
        // });
        
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})