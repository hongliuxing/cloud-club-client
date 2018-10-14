// component/NewsList/child/Row.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        mLeft: Number,
        item: {
            type: Object,
            value: {},
            observer: function (newVal, oldVal, changedPath) {
                // console.log('[item newVal] : ', newVal);
                // 格式化日期(去掉时间)
                if (newVal.createdAt){
                    this.setData({
                        "item.createdAt": newVal.createdAt.split(" ")[0]
                    });
                }
                // 初始化图片数量
                this.setData({
                    pics: Array(newVal.pic_count).fill({})
                });
            }
        },
        colors: {
            type: Array,
            value: [],
            observer: function (newVal, oldVal, changedPath) {
                if (Array.isArray(newVal) && newVal.length > 0) {
                    let c = newVal[~~(Math.random() * newVal.length)]
                    // console.log(c);
                    this.setData({ dateColor: c });
                }
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        dateColor: "red",
        pics: []
    },
    /**
     * 加载事件
     */
    ready() {
        
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})