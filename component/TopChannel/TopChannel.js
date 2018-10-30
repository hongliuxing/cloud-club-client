/**
 * 测试数据：
 * let topBtns = [
        { title: "频道1", btype: "event", value: (e) => { console.log('this is 频道2 event !!!'); }},
        { title: "频道2", btype: "event", selected: true, value: (e) => { console.log('this is 频道2 event !!!'); } },
        { title: "频道3", btype: "list", value: {
            range: [{ ind: 0, title: '陕师大' }, { ind: 1, title: '西法大' }, { ind: 2, title: '外国语大学' }],
            rangeKey: 'title',
            index: 1,
            bindchange: function(e, target) {
                // console.log("触发了下拉....", this.index, target.data.btnConf);
                // target表示目标组件
                target.setData({ 'btnConf.value.index': e.detail.value});
            }
        } }
    ];
 */
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 标签按钮数组
        // el：title(标题)，btype（点击类型：list、url、event），value（点击值）
        // selected(是否被选中，仅对btype为event的节点有效)
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
            type: Array, value: [],
            observer: function (newVal, oldVal, changedPath) {
                let { isTruncation, maxCount, btns } = this.data;
                if (isTruncation && maxCount < btns.length){
                    // 截断数组操作
                    newVal.length = maxCount;
                    this.setData({ btns: newVal })
                }
                // 计算子按钮宽度
                if (btns.length !== 0){
                    // 并不截断时，如果频道数量大于最大显示频道数量，则多余的默认隐藏
                    let _childWidth = !isTruncation ? (100 / Math.min(maxCount, btns.length)) :(100 / btns.length);
                    this.setData({ 
                        childWidth: _childWidth + '%'
                    });
                }
                // 如果需要滚动,初始化时显示右侧箭头
                if (!isTruncation && maxCount < btns.length){
                    this.setData({ arrowRight: '' });
                }
            }
        },
        maxCount: { // 频道最大数量限制
            type: Number, value: 3
        },
        isTruncation: { // 是否截断频道数组
            type: Boolean, value: true
        },
        bgColor: {
            type: String, value: '#fff',
            observer: function (newVal, oldVal, changedPath) {
                console.log('new bgColor: ', newVal);
            }
        },
        fontColor: {
            type: String, value: '#555',
            observer: function (newVal, oldVal, changedPath) {
                console.log('new fontColor: ', newVal);
            }
        },
        isFixed: {
            type: Boolean, value: true
        }
    },
    externalClasses: ["channel-class"],
    /**
     * 组件的初始数据
     */
    data: {
        // 被选中的 btn index
        selectedIndex: 0,
        arrowLeft: 'none',
        arrowRight: 'none'
    },
    attached(){
        // console.log('attached: ', this.data.btns);
    },
    /**
     * 页面加载事件
     */
    ready() {
        // console.log('ready: ', this.data);
        // let {btns} = this.data;
        
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 父组件中触发“频道改变事件”，改变频道显示
        onChannelChange(e){
            // console.log('父组件触发了onChannelChange： ', e.detail);
            this.setData({ selectedIndex: e.detail});
        },
        // 上/左侧
        // onScrollToupper(e){
        //     console.log('到了左侧: ', e);
        // },
        // 下/右侧
        // onScrollTolower(e){
        //     console.log('到了右侧: ', e);
        // },
        // 开始滚动
        onScroll(e){
            let { arrowLeft, arrowRight} = this.data;
            let { screenWidth } = wx.getSystemInfoSync();
            let { scrollLeft, scrollWidth } = e.detail;
            let maxScrollDist = scrollWidth - screenWidth;// 最大滚动距离
            // console.log('开始滚: ', e);
            // 左侧三角
            if (scrollLeft > 20 && arrowLeft === 'none'){
                // 显示左侧三角
                this.setData({ arrowLeft: '' }); 
            } else if (scrollLeft < 20 && arrowLeft !== 'none'){
                // 隐藏左侧三角
                this.setData({ arrowLeft: 'none' }); 
            }
            // 右侧三角
            if (scrollLeft < maxScrollDist - 30 && arrowRight === 'none') {
                // 显示右侧三角
                this.setData({ arrowRight: '' }); 
            } else if (scrollLeft > maxScrollDist - 30 && arrowRight !== 'none'){
                // 隐藏右侧三角
                this.setData({ arrowRight: 'none' });
            }
        }
    }
})