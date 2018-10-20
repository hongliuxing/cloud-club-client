/**
 * 简单列表所使用的控制器
 * 主要控制数据的数组显示/填充
 * 页码控制
 * 事件控制等
 */
class SimpleDataController{

    constructor(){
        this.pagenum = 0;
        this.list = [];
        this.hasMore = true; // 是否有更多数据(处理下拉刷新时一直跳的bug)
    }

    // 要加载的下一个数据时的页码
    nextPagenum() {
        this.pagenum++;
        return this.pagenum;
    }

    /**
     * 为 list 中填充数据
     * arr: 新增的数组数据
     * append: 是否在末尾追加数据( true为末尾追加, false为完全替换 )
     */
    push(arr, append = true){
        if(!Array.isArray(arr)){
            throw new Error('进来的数据并不是一个数组!');
        }
        // 推送数据前置事件触发
        arr = this.onBeforePush(arr) || arr;
        // 将数据 添加/替换 原有数组
        if (append){
            this.list = this.list.concat(arr);
        }else{
            this.list = arr;
        }
        // 返回更新后的数据, 便于 view 层渲染
        return this.onAfterPush() || this.list;
    }

    onBeforePush(arr){
        return arr;
    }

    onAfterPush(){
        return this.list;
    }

}

export default SimpleDataController;