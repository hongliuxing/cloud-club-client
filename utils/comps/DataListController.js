import * as Actions from "../net/Actions.js";
import * as URLs from "../net/urls.js";
/**
 * DataList中的控制器对象
 * 仅仅服务于 "社团活动" 列表专属定制
 */
class DataListController{
    constructor({ data={}, tabIndex=0, onTap, push}){
        this.data = data;
        this.list = []; // 当前标签页的list数据
        this.tabIndex = tabIndex;
        this.more = true; // 是否有更多数据(处理下拉刷新时一直跳的bug)
        this.pagenum = 0; // 默认初始页面是0, 但实际上页面是从1开始的,因此每次都调用nextPagenum方法
        this.now = new Date(); // 今天
        this.isQueryed = false;

        // 关于空数据的提示配置(数组)
        /**
         * openType: navigate, redirect, switchTab
         */
        this.emptyData = [
            [{url: null, text: '空哒空哒空哒!'}],
            [{ text: '点击' }, { url: '/pages/index/index', openType:'switchTab', text: '这里'},{text: '查看更多内容!'}]
        ];

        this.onTap = onTap;
        this.push = push;

        /**
         * 一些自定义事件的总控
         */
        this.onToggleLuv = (e) => new Promise( (resolve, reject) => {
            // 执行切换关注的方法
            if (!e.detail.item){
                return reject('数据有误!');
            }
            let { club_id, isAttention } = e.detail.item;
            if (typeof isAttention !== 'number'){
                return reject('数据有误!');
            }
            let url = '';
            if (isAttention === 1){
                url = URLs.CLUB_ATTENTION_CANCEL;
            } else if (isAttention === 0){
                url = URLs.CLUB_ATTENTION_ADD;
            }
            console.log('切换关注:::::', e.detail.item, isAttention);
            
            // 进行关注行为, 或取消关注行为
            Actions.doPost({
                url: url,
                data: {
                    club_id
                }
            }).then(res => {
                // 返回数据包含 数据库操作数据, 及点赞行为描述
                resolve({ res, isAttention, club_id})
            }).catch(reject);
        } );

        this.onHeat = (e) => {
            // 点赞
            let that = this;
            console.log('点赞:::::', e);
            let {item} = e.detail;
            let activity_id = item ? item.id: null;
            if (!activity_id) return Promise.reject();
            
            return Actions.doPost({
                url: URLs.TORCH_HEATING,
                data: { activity_id }
            }).then( res => {
                console.log('点赞结果 成功: ', res);
            }).catch(err => {
                console.log('点赞结果 失败: ', err);
            });
        };

        this.onComment = (e) => new Promise((resolve, reject) => {
            // 调起评论入口
            console.log('调起评论入口:::::', e);
            let { title, id, comment_count, logo_url } = e.detail.item;
            wx.navigateTo({
                url: `/pages/activity/comment/comment?id=${id}&title=${title}&comment_count=${comment_count}&logo_url=${logo_url}`
            })
        });

        this.onShare = (e) => new Promise((resolve, reject) => {
            // 分享
            console.log('分享:::::', e);
        });
    }

    // 要加载的下一个数据时的页码
    nextPagenum(){ 
        this.pagenum++;
        return this.pagenum;
    }

    // 添加日期标签
    addDateLabel(arr) {
        let that = this;
        // 添加日期标记
        let week = [], month = [], threeMonth = [], year = [], other = [];
        let diff;
        Array.isArray(arr) && arr.forEach(item => {
            diff = ((that.now - new Date(item.createdAt)) / (1000 * 60 * 60 * 24));
            if (diff <= 7) {
                // console.log('【一周内】=> ', diff, ' => ', item);
                if (week.length === 0) {
                    week.push({ type: 'date', text: '一周内' });
                }
                week.push(item);
            } else if (diff <= 30) {
                if (month.length === 0) {
                    month.push({ type: 'date', text: '一个月内' });
                }
                month.push(item);
            } else if (diff <= 90) {
                if (threeMonth.length === 0) {
                    threeMonth.push({ type: 'date', text: '三个月内' });
                }
                threeMonth.push(item);
            } else if (diff <= 365) {
                if (year.length === 0) {
                    year.push({ type: 'date', text: '一年内' });
                }
                year.push(item);
            } else {
                if (other.length === 0) {
                    other.push({ type: 'date', text: '大于一年' });
                }
                other.push(item);
            }
        });
        return week.concat(month, threeMonth, year, other);
    }
    /**
     * 切换关注
     */
    // toggleLuv(e){
    //     console.log('切换关注:::::', e);
    // }
}

// DataListController.prototype.toggleLuv = (e) => {
//     console.log('切换关注2 :::::', e);
// }

export default DataListController;