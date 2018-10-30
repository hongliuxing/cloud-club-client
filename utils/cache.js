/**
 * 用于进行缓存数据的版本控制
 */

class DataVersion{

    constructor(title){
        // 实例化时获取当前版本
        this._version = new Date();
        this.title = title;
    }

    getVersion(){
        return this._version;
    }
    /**
     * 对比
     * 版本时间一致, 返回true
     */
    equals(otherVersion){
        if (!this._version || !otherVersion) return false;
        return this._version == otherVersion;
    }
    /**
     * 刷新, 并返回新的版本
     */
    reflush(){
        let newVersion = new Date();
        this._version = newVersion;
        return newVersion;
    }
}

// 关注度
export const AttentionCache = new DataVersion();