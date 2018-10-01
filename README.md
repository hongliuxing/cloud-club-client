## 组件篇

### 标签页组件 TopChannle
> 标签页栏设计思路:允许传递(频道按钮)数组,以构建不同的标签表现
> 标签按钮主要分为: `普通事件按钮` 和 `下拉框按钮`

![](https://i.imgur.com/AmRjVTU.png)

### 使用步骤
1. **引入组件**
``` json
// json部分
{
    "usingComponents": {
        "top-channel": "/component/TopChannel/TopChannel"
    }
}
```
``` html
// wxml部分
<view class="container">
    <top-channel btns="{{topBtns}}" is-truncation="{{false}}"></top-channel>
</view>
```
``` javascript
// js部分
// 这里用于定义组件配置对象
let topBtns = [
        { title: "频道1", btype: "event", value: (e) => { console.log('this is 频道1 event !!!'); }},
        { title: "频道2", btype: "event", value: (e) => { console.log('this is 频道2 event !!!'); } },
		{ title: "频道3", btype: "event", value: (e) => { console.log('this is 频道3 event !!!'); } }
];
// 将topBtns配置对象交于data,并且在wxml部分渲染组件时传递
this.setData({
        topBtns: topBtns
});
```
2. **top-channel配置说明**

参数名 | 类型 | 注释
--------  | ------ | --------
**btns** | Array | 表示频道按钮的数组
-- channel | Object | 频道按钮对象
---- title | String | 频道名称
---- btype | String | 频道类别(可选`event`和`list`)
---- value | String | 频道按钮值(根据类别不同,值也不同)
**is-truncation** | Boolean | （默认值：true）是否截断频道数组。频道默认显示最大按钮数量为·3·，如果该值为true，则btns数组超出最大数量的部分将被忽略（可调整最大数量，不建议超过4）。**而当截断值为false时**，如果此时btns数量超出默认最大显示数量，则提供滑动显示更多频道按钮。
**max-count** | Number | 频道按钮最大数量（默认为：3）
**bg-color** | String | 频道默认背景颜色(默认为: #ffffff)

### 关于`btype`类型的说明
1. **当`btype`是`event`类型时,`value`应当是一个函数**
``` javaScript
{ 
	title: "频道2", 
	btype: "event", 
	value: (e) => { 
		// 当频道按钮点击事件触发时,会执行这个函数
		console.log('this is 频道2 event !!!'); 
	} 
}
```
> 但这样的写法会让配置文件变得过大,因此建议写法是:
 
``` javaScript
// 首先在小程序中定义一个用于处理频道点击事件的函数,比如:
Page({
	// 一些生命周期
	
	// 频道按钮点击事件
	onChannel1Tap(e){
		// do something...
	}

	// 频道按钮点击事件
	onChannel2Tap(e){
		// do something...
	}

	// 页面加载时,配置组件
	onLoad(){
		let topBtns = [
	        { title: "频道1", btype: "event", value: this.onChannel1Tap },
	        { title: "频道2", btype: "event", value: this.onChannel2Tap }
		];
		this.setData({
	        topBtns: topBtns
	    });
	}

});
```
2. **当`btype`是`list`类型时,`value`应当是一个`picker`组件的配置对象**

``` javaScript
// 首先在小程序中定义一个用于处理频道点击事件的函数,比如:
Page({
	// 一些生命周期
	
	// 频道按钮点击事件
	onChannel1Tap(e){
		// do something...
	}

	/**
	 * 频道按钮触发下拉选择事件
	 * e: 事件对象
	 * index: 当前触发下拉的索引
	 * rangeArr: 当前下拉列表数组
	 * target: 当前频道按钮对象(相当于频道按钮中的this)
	 */
	onChannel2Change(e, index, rangeArr, target){
		// do something...
		console.log("触发了下拉....");
		console.log('这是当前选择的索引:', index );
		console.log('这是列表中的数组:', rangeArr );
	}

	// 页面加载时,配置组件
	onLoad(){
		// 构建一个一维数组
		let schoolArr = [{ ind: 0, title: '陕师大' }, { ind: 1, title: '西法大' }, { ind: 2, title: '外国语大学' }];
		let topBtns = [
	        { title: "频道1", btype: "event", value: this.onChannel1Tap },
	        { title: "频道2", btype: "event", value: {
	                range: schoolArr, 	// 列表数组
	                rangeKey: 'title', 	// 列表中显示的内容
	                index: 1,			// 默认显示的索引位置
	                bindchange: this.onChannel2Change
        		}// end: value 
			}
		];
		this.setData({
	        topBtns: topBtns
	    });
	}

});
```