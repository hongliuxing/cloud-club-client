// component/NewsList/NewsList.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // Panel面板中的行数据
        rows: {
            type: Array,
            value: [],
            observer: function (newVal, oldVal, changedPath) {
                // console.log('[rows newVal] : ', newVal);
                
            }
        },
        // [作废] (多Panel时) 当前 Panel 是否被激活
        active: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal, changedPath) {
                
            }
        },
        // 面板的最小高度(初始)
        // 由调用者进行计算
        minHeight: {
            type: Number, value: 0
        },
        // 控制器对象, 主要用于绑定行点击事件
        // 省略了为每一行数据添加点击函数
        bean: {
            type: Object
        },
        // 是否拥有时间线(必须是时间倒序)
        hasTimeline: {
            type: Boolean, value: true
        },
        // 背景颜色
        bgcolor: {
            type: String, value: '#F9F9F9'
        },
        // 是否在没有数据时,显示空标识
        showEmpty: {
            type: Boolean, value: true
        },
        // 是否查询结束
        isQueryed: {
            type: Boolean, value: false,
            observer: function (newVal, oldVal, changedPath) {
                console.log('isQueryed ::::::', newVal);
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // [作废] 列表ID,用于获取元素, 计算高度
        listId: 'news-list-1',
        // 默认列表最小高度
        // minHeight: 0,
        // 列表内边距
        padding: {
            top: 60, right: 30, bottom: 60, left: 60
        },
        
        colors: ['#00A1E9', '#00A497', '#7A4171', '#CD5E3C', '#C85179', '#69821B', '#68699B', '#028760', '#E6B422', '#BB5548', '#1E50A2', '#887F7A']
    },
    /**
     * UI 加载完成之后
     */
    ready(){
        let that = this;
        // console.log('row =>>', this.data.rows);
        // // 组件内部查询元素
        // const query = wx.createSelectorQuery().in(this);
        // // 查询当前渲染的组件元素
        // query.select('#' + this.data.listId ).boundingClientRect(function (res) {
        //     // 获取当前窗口的默认高度(px)
        //     let { windowHeight } = wx.getSystemInfoSync();
        //     // console.log('location: ', { res, screenHeight, windowHeight, pixelRatio });
        //     // 设置当前列表组件的最小高度( 窗口高度 - 组件元素的顶部位置 )
        //     that.setData({
        //         minHeight: windowHeight - res.top
        //     });
        // }).exec();
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 触发单击事件时,调用控制器的单击事件,并传入触发的行数据
         */
        onRowTap( e ){
            if (typeof this.data.bean.onTap == 'function'){
                this.data.bean.onTap( e );
            }
        },
        /**
         * 切换关注
         */
        onLuvTap( e ){
            // console.log('切换关注: ', this.data.bean);
            if (typeof this.data.bean.onToggleLuv == 'function') {
                this.data.bean.onToggleLuv(e);
            }
        },
        /**
         * 点赞
         */
        onLike(e){
            // console.log('点赞: ', this.data.bean);
            if (typeof this.data.bean.onLike == 'function') {
                this.data.bean.onLike(e);
            }
        },
        /**
         * 调起评论入口
         */
        onComment(e) {
            // console.log('调起评论入口: ', this.data.bean);
            if (typeof this.data.bean.onComment == 'function') {
                this.data.bean.onComment(e);
            }
        },
        /**
         * 分享
         */
        onShare(e) {
            // console.log('分享: ', this.data.bean);
            if (typeof this.data.bean.onShare == 'function') {
                this.data.bean.onShare(e);
            }
        }
    }
})