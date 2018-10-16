/**
 * DataList中的控制器对象
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

        this.onTap = onTap;
        this.push = push;
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
}

export default DataListController;