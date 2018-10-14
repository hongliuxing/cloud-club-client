// component/NewsList/NewsList.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        rows: {
            type: Array,
            value: [],
            observer: function (newVal, oldVal, changedPath) {
                // console.log('[rows newVal] : ', newVal);
                
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 列表ID,用于获取元素, 计算高度
        listId: 'news-list-1',
        // 默认列表最小高度
        minHeight: 0,
        // 列表内边距
        padding: {
            top: 60, right: 30, bottom: 60, left: 60
        },
        // 是否拥有时间线(必须是时间倒序)
        hasTimeline: true,
        colors: ['#00A1E9', '#00A497', '#7A4171', '#CD5E3C', '#C85179', '#69821B', '#68699B', '#028760', '#E6B422', '#BB5548', '#1E50A2', '#887F7A']
    },
    /**
     * UI 加载完成之后
     */
    ready(){
        let that = this;
        // 组件内部查询元素
        const query = wx.createSelectorQuery().in(this);
        // 查询当前渲染的组件元素
        query.select('#' + this.data.listId ).boundingClientRect(function (res) {
            // 获取当前窗口的默认高度(px)
            let { windowHeight } = wx.getSystemInfoSync();
            // console.log('location: ', { res, screenHeight, windowHeight, pixelRatio });
            // 设置当前列表组件的最小高度( 窗口高度 - 组件元素的顶部位置 )
            that.setData({
                minHeight: windowHeight - res.top
            });
        }).exec();
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})