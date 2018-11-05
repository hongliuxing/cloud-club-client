// component/Btn/Btn.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        height: {
            type: Number,
            value: 100
        },
        back: {
            type: String,
            value: "#57d8d6"
        },
        value: String,
        disabled: {
            type: Boolean,
            value: false
        },
        // 是否需要form表单的按钮,默认false
        formBtn: {
            type: Boolean,
            value: false
        }
    },
    externalClasses: ["btn-class"],

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onclick(e) {
            if (!this.data.disabled) {
                this.triggerEvent('click', e.detail)
            }
        }
    }
})