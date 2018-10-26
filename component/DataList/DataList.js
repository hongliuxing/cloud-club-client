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
        
        colors: ['#00A1E9', '#00A497', '#7A4171', '#CD5E3C', '#C85179', '#69821B', '#68699B', '#028760', '#E6B422', '#BB5548', '#1E50A2', '#887F7A'],

        torchNum: 0
    },
    /**
     * UI 加载完成之后
     */
    attached(){
        let that = this;
        // that.reflushTorch();
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
            let that = this;
            if (typeof this.data.bean.onToggleLuv == 'function') {
                // 关注行为, 返回结果是一个 Promise
                wx.showLoading({
                    title: '加入收藏夹...',
                    mask: true
                })
                this.data.bean.onToggleLuv(e)
                    .then(({ res, isAttention, club_id }) => {
                        console.log('关注结果: ', res);
                        wx.hideLoading();
                        if(res.data.err){
                            return console.log('关注返回结果有误: ', res);
                        }
                        if (isAttention === 0 && typeof res.data.info === 'object'){
                            // 关注成功
                            that.data.rows.forEach( r => {
                                if (r.club_id === club_id)
                                    r.isAttention = 1;
                            } );
                            that.setData({
                                rows: that.data.rows
                            })
                        } else if (isAttention === 1) {
                            // 取消关注成功
                            that.data.rows.forEach(r => {
                                if (r.club_id === club_id)
                                    r.isAttention = 0;
                            });
                            that.setData({
                                rows: that.data.rows
                            })
                        }
                    }).catch(err => {
                        wx.hideLoading();
                        console.log('关注异常: ', err);
                    });
            }
        },
        /**
         * 点赞
         */
        onHeat(e){
            let that = this;
            // 获取用户信息
            let uinfo = wx.getStorageSync('userInfo');
            // 点赞前判断火把数量
            if (uinfo['current_torch'] <= 0){
                return wx.showToast({
                    title: '火把用完啦',
                })
            }
            if (typeof this.data.bean.onHeat == 'function') {
                this.data.bean.onHeat(e).then(res=>{
                    console.log('Datalist: 点赞成功=> ', e);
                    if (e.detail.addHeatNum){
                        typeof e.detail.addHeatNum == 'function' && e.detail.addHeatNum();
                    }
                    // 提示点赞成功
                    wx.showToast({
                        title: '活动加温成功!',
                        duration: 1500,
                        mask: true
                    })
                    // 点赞成功, 先消耗火把
                    uinfo['current_torch'] = Number(uinfo['current_torch']) - 1;
                    uinfo['luck'] = Number(uinfo['luck']) + 1;
                    wx.setStorageSync('userInfo', uinfo);
                    // 待刷新 mine 数据
                    wx.setStorageSync("mineRefresh", true);
                    that.triggerEvent('onReflushPanelHeat', 'ok', { bubbles: true });
                });
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
        },
        /**
         *  刷新火把数量数据
         */
        // reflushTorch() {
        //     let that = this;
        //     let info = wx.getStorageSync('userInfo');
        //     console.log('DataList 刷新火把数量: ====> ', info['current_torch']);
        //     that.setData({
        //         torchNum: info['current_torch']
        //     });
        // }
    }
})