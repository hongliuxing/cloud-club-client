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
                    pics: Array(newVal.pic_count).fill(0)
                });
                // 加载图片
                // console.log('imgs::  ',newVal);
                if ( newVal && newVal.imgs){
                    this.setData({
                        pics: newVal.imgs
                    });
                    // 将图片对象数组, 解析为简单的图片字符串数组
                    let previewArr = newVal.imgs.map(img => img.pic_url);
                    this.setData({
                        previewArr: previewArr
                    });
                }
                
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
        pics: [],
        timingColor: "#a6a6a6"
    },
    /**
     * 加载事件
     */
    ready() {
        // console.log('Row.js...', this.data.item.imgs);
        this.setData({
            timingColor: this.getTimingColor(this.data.item.timing_text)
        });
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onTap(e){
            let that = this;
            that.triggerEvent('RowTap', {item: that.data.item}, { bubbles: true });
            
        },
        onProview(e){
            // console.log(e.currentTarget.dataset.index);
            // e.stopPropagation();
            var index = e.currentTarget.dataset.index;
            var imgArr = this.data.previewArr;
            // console.log(imgArr);
            wx.previewImage({
                current: imgArr[index],
                urls: imgArr,
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
            })
        },
        /**
         * 获取表示时机的背景色
         */
        getTimingColor(timing_text){
            if (timing_text == '活动总结'){
                return "#8F5EC0";
            } else if (timing_text == '活动即将开始') {
                return "#DA2A14";
            } else if (timing_text == '活动进行中') {
                return "#05A2E9";
            } else if (timing_text == '已结束') {
                return "#bbbbbb";
            }else{
                return "#FFF";
            }
        },
        /**
         * 切换爱
         * 收藏或取消收藏
         */
        onLuvTap( e ){
            let that = this;
            console.log('ROW  切换爱', that.data.item);
            // that.triggerEvent('RowTap', { item: that.data.item }, { bubbles: true });
            that.triggerEvent('LuvTap', { item: that.data.item }, { bubbles: true });
        },
        /**
         * 点击点赞
         */
        onHeat(e) {
            let that = this;
            // console.log('ROW  点击点赞', that.data.item);
            // that.triggerEvent('RowTap', { item: that.data.item }, { bubbles: true });
            that.triggerEvent('Heat', { item: that.data.item }, { bubbles: true });
        },
        /**
         * 点击评论
         */
        onComment(e) {
            let that = this;
            console.log('ROW  点击评论', that.data.item);
            // that.triggerEvent('RowTap', { item: that.data.item }, { bubbles: true });
            that.triggerEvent('Comment', { item: that.data.item }, { bubbles: true });
        },
        /**
         * 点击每一行的分享
         */
        onShare(e) {
            // let that = this;
            // console.log('ROW  点击分享', that.data.item);
            // that.triggerEvent('Share', { item: that.data.item }, { bubbles: true });
        },

        /**
         * 转发事件触发
         */
        // onShareAppMessage(e){
        //     let that = this;
        //     console.log('转发事件: ', e);

        //     return {
        //         title: "" + that.data.item.school,
        //         path: "/pages/activity/info/info?id=" + that.data.item.club_id
        //     };
        // }

    }// end: method
})