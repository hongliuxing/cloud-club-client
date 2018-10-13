import * as Actions from "../../utils/net/Actions.js";
import * as URLs from "../../utils/net/urls.js";
//获取应用实例
const app = getApp()

const newsList = [
    {type: 'date', text: '一周前'},
    {
        id: '45544c0c-ccaa-11e8-899b-54bf64582633',
        title: '山穆宇晓翠祥',
        content: '于煊湛竹幼以幼朱应卜朗臧魏萱翠晗如邃擎举紫恨丁伏谢雪念夏昊凤晓蓉千干泽钮诚诚乐乐虞谷梁云熠俊代山盼梦香',
        createdAt: '2018-10-10 21:25:25',
        club_title: '敏庞博社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/007.jpg',
        school: '西安外国语大学',
        pic_count: 2,
        heat: 632
    },
    {
        id: '454d6202-ccaa-11e8-899b-54bf64582633',
        title: '灿米李晓弘',
        content: '马史田竹睿夏盼建尧康语彭语菱严恨豪怜若菱涵韩雪霖儿翠计梅寻马萱亦香旋岚鲁亦彭晟若华兰荣瑶竹谷晟易元敏煊雪强宇润惜泽柳寻琪紫懿鹏岚风涵沈',
        createdAt: '2018-09-27 05:22:08',
        club_title: '幼麻魏社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/001.png',
        school: '西安外国语大学',
        pic_count: 8,
        heat: 185
    },
    {
        id: '454d3e03-ccaa-11e8-899b-54bf64582633',
        title: '翠彤幼单文郎',
        content: '心卢席胡向谢安嘉恨秉瑜刁煊寒鑫孙璞靖新翠蓝傲任潘谢奚谈香蓝祝戚芷宇高茅颜琴明梦轩半',
        createdAt: '2018-09-16 04:14:42',
        club_title: '幼麻魏社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/001.png',
        school: '西安外国语大学',
        pic_count: 2,
        heat: 490
    },
    {
        id: '454b17af-ccaa-11e8-899b-54bf64582633',
        title: '张涛皓范萧春',
        content: '翠史寻柏冰轩阮魏乐丁路樊紫乾济潘夏张煊方华臧穆骆柏柳彬怀蕾洁',
        createdAt: '2018-09-05 01:57:35',
        club_title: '幼麻魏社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/001.png',
        school: '西安外国语大学',
        pic_count: 5,
        heat: 640
    },
    {
        id: '454698b4-ccaa-11e8-899b-54bf64582633',
        title: '磊卉存达秉翠向雁存',
        content: '明群懿蓝霜蓉香柏文钮勤沈丘朋吉黎葛童梦天尔鲍伍致黎妙坚宋葛竹琪华开郑郭成麻潘天傲龚健旭黎新琴懿君涛痴以狄翠波菡靖云蔡旭卢杨磊施博瑜崔伍',
        createdAt: '2018-09-01 18:42:13',
        club_title: '明香寒社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/011.jpg',
        school: '西安外国语大学',
        pic_count: 5,
        heat: 983
    },
    {
        id: '4544c9a0-ccaa-11e8-899b-54bf64582633',
        title: '昊宇荣轩成',
        content: '哲安格梦坚潘向翠溥远海远葛单韦菡丹存梦泽秉问泽代昕凡泽泽义泽袁危代赵彬煜琪菡苏语巧凌缪莲',
        createdAt: '2018-08-28 16:25:04',
        club_title: '明香寒社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/011.jpg',
        school: '西安外国语大学',
        pic_count: 6,
        heat: 902
    },
    {
        id: '4549a755-ccaa-11e8-899b-54bf64582633',
        title: '支易滑朋苗尔凯菱',
        content: '靖董泽安寒韩浩诚郭远龚童强远梁柏醉从翠以谈庞鸿麻坚杨昊萱春施路君翠谷春瑶浩凌郎宇怀珊醉蕾香良忆经涵山',
        createdAt: '2018-08-27 15:21:52',
        club_title: '宸卉然社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/006.png',
        school: '西安外国语大学',
        pic_count: 4,
        heat: 906
    },
    {
        id: '45411025-ccaa-11e8-899b-54bf64582633',
        title: '烨濮鸿云祁邃映露舒',
        content: '夏忆语茅驰程滑慕灿程昊寒瑶芙苍萱乐戚锺涵杰泽宛梦翠葛痴唐俞伍远从烨凌凤新烨柳谷齐杰应解语云蕾雪经狄严怀碧真辉同万祺',
        createdAt: '2018-08-24 20:42:59',
        club_title: '灵葛蕾社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/002.jpg',
        school: '西安外国语大学',
        pic_count: 1,
        heat: 844
    },
    {
        id: '4553bc22-ccaa-11e8-899b-54bf64582633',
        title: '君麻滕季琪嘉常',
        content: '陆童伏江晴海泽霍戴平屈玉海妙昝香泽梦柔峻缪娄贲亦烟念之康鸿韩博海葛华昕皮安周曼倪平乐经志丘健向郭修缪俞靖宋尔鑫鑫彭奚时伟孤凌易泽蓉',
        createdAt: '2018-08-23 19:36:41',
        club_title: '敏庞博社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/007.jpg',
        school: '西安外国语大学',
        pic_count: 4,
        heat: 851
    },
    {
        id: '454a9e6b-ccaa-11e8-899b-54bf64582633',
        title: '韩方杰文炎',
        content: '航涛尧彭露晗皮靖彤彬伟骞瑾泽煊茂熠之青玉骆明紫杨锦岚冯宇弘鹏卫谢季菡辉博寒春翠',
        createdAt: '2018-08-11 13:42:49',
        club_title: '幼麻魏社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/001.png',
        school: '西安外国语大学',
        pic_count: 3,
        heat: 612
    },
    {
        id: '4550cc57-ccaa-11e8-899b-54bf64582633',
        title: '晴罗施浩穆',
        content: '贲柏兰靖荣卫任远菱珊雪语伍祁驰立沛彬书安易熊煜海幼痴宇旋蕾建凯华松青祁忆',
        createdAt: '2018-08-06 16:50:11',
        club_title: '韩潘卢社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/003.jpg',
        school: '西安外国语大学',
        pic_count: 4,
        heat: 343
    },
    {
        id: '454722e5-ccaa-11e8-899b-54bf64582633',
        title: '怀锺夏伟又驰崔',
        content: '文远兰香亦郭格海程濮孟恨魏贝曼雪语泽云鹤桃柳语竹雪鹏潘左殷山皓怀雨擎渊昊哲宸春驰青',
        createdAt: '2018-07-23 22:19:48',
        club_title: '明香寒社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/011.jpg',
        school: '西安外国语大学',
        pic_count: 7,
        heat: 996
    },
    {
        id: '45434756-ccaa-11e8-899b-54bf64582633',
        title: '笑汤若睿颜',
        content: '鑫博山杨诚伟伟骆绿泽皮桃蕾代之靖志娄翠祝安真骞听安戴成涛幼解华杰湛龚海雪春苍鹏文紫熊鸿彭周罗琴孟杜又语煊绿伍之巧露松柯齐奥江解灵明瑶鹤李恨石建天远陆豪',
        createdAt: '2018-07-20 13:49:22',
        club_title: '明香寒社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/011.jpg',
        school: '西安外国语大学',
        pic_count: 6,
        heat: 616
    },
    {
        id: '48380b2a-ccaa-11e8-899b-54bf64582633',
        title: '柳山以菱代山风鲍泽',
        content: '嘉程涵怀烟许致访盛云雪童乐江汤灿龚儿汤柔春臧煜苗初举香韩昊彤香易博越菡旭薛瀚问孟鑫彤易贾沈萱菡文姜孟彤孟和陆语义冯元真南建奇凌殷辉安刁戴蓝梦天天平',
        createdAt: '2018-07-19 06:25:18',
        club_title: '易严辉社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/015.jpg',
        school: '陕西青年职业学院',
        pic_count: 9,
        heat: 9
    },
    {
        id: '454ea1f9-ccaa-11e8-899b-54bf64582633',
        title: '玉柏菱明冬元辉',
        content: '香易浩亦雁萱马轩明明常梦翠曼凌姚山杰雨亦康佑同旋远鹏南光海洪经浩寒丹波樊浦昊香朱熠凡同哲彭赵花昊香华半佑陈彭涛文岑香张海青盼霜潘蓝鹏曼靖谢梅',
        createdAt: '2018-07-11 20:09:15',
        club_title: '卉顾雁社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/019.jpg',
        school: '西安外国语大学',
        pic_count: 1,
        heat: 99
    },
    {
        id: '4837de79-ccaa-11e8-899b-54bf64582633',
        title: '山宛朗米韩靖经闽丘',
        content: '柏香成曼巧李祝强乐骞柯绿樊煊孔庞代酆裴贺梦水杭汤盼瑜盼易黎泽俊明博宇紫安明宋翰康毕翠彭嘉翠擎安哲伟华贲夏田霖',
        createdAt: '2018-07-08 10:22:33',
        club_title: '易严辉社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/018.jpg',
        school: '陕西青年职业学院',
        pic_count: 3,
        heat: 707
    },
    {
        id: '454463ec-ccaa-11e8-899b-54bf64582633',
        title: '碧季轩又石',
        content: '江霜远朋伟龚之江宛博谷翰席干听乐晟青任滕钮周诸贲玉映泽滑麻齐曹鹏璞从桃瑾危梁烨存楮伍雪瑞旭玉汤柳蓝山城戴安轩柳锦成赵狄冷阮新窦郝远寻霜郭烨',
        createdAt: '2018-07-04 15:53:30',
        club_title: '明香寒社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/011.jpg',
        school: '西安外国语大学',
        pic_count: 2,
        heat: 867
    },
    {
        id: '454fc501-ccaa-11e8-899b-54bf64582633',
        title: '平绿巧熠烟乐之柔',
        content: '辉罗勤彤冰皓解王煊访缪柯梦青晗伍安擎萧柏鹏蓉之念宗费新熙桃鑫萱泽',
        createdAt: '2018-06-24 14:24:14',
        club_title: '韩潘卢社',
        logo_url: 'https://sheu-huabei5.oss-cn-huhehaote.aliyuncs.com/test/logo/010.jpg',
        school: '西安外国语大学',
        pic_count: 3,
        heat: 535
    }
];

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasLoginer: wx.getStorageSync("loginer"),
        newsListData: newsList
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    /**
     * 若无登录态则尝试登录一次
     */
    checkLogin() {
        if (!this.data.hasLoginer) {
            // 如果没有登录态则登录一次
            wx.showLoading({ title: '正在组装社团...', mask: true });
            return Actions.login();
        }else{
            return Promise.resolve();
        }
    },
    // 用于处理标签页的点击
    onTabbarClick(club_id){
        console.log('点击的标签页id是:', club_id);
    },
    /**
     * 加载社团,并填充标签页按钮
     */
    loadMyClub(){
        let that = this;
        // 返回的是请求的Promise
        return Actions.doGet({
            url: URLs.CLUB_SIMPLE_LIST,
            data: {}
        }).then(res => {
            console.log('我的社团 res: ', res);
            // 我的社团数据
            let clubs = res.data.list? res.data.list: [];
            clubs.unshift({
                title: '全部社团',// 社团名称
                btype: "event",
                // 这里统一绑定了一个点击之后的处理函数,并传递当前对象的id过去
                value: () => that.onTabbarClick('all')
            });
            // 将社团数组生成标签页按钮所需的数据
            let topBtns = clubs.map(club => {
                return {
                    title: club.title,// 社团名称
                    btype: "event",
                    // 这里统一绑定了一个点击之后的处理函数,并传递当前对象的id过去
                    value: () => that.onTabbarClick(club.id)
                };
            });
            that.setData({
                topBtns: topBtns
            });
        }).catch(err => {
            console.log('我的社团 err: ', err);
        });
    },
    onLoad: function() {
        this.checkLogin().then(res => {
            // 首次登录成功
            wx.hideLoading();
        })
        .then(this.loadMyClub)
        .catch(err => {
            // 失败
            console.log(err);
        });

        // 标签页频道组件
        // let topBtns = [{
        //         title: "全部社团",
        //         btype: "event",
        //         value: (e) => {
        //             console.log('this is 频道1 event !!!');
        //         }
        //     },
        //     {
        //         title: "频道2",
        //         btype: "event",
        //         value: (e) => {
        //             console.log('this is 频道2 event !!!');
        //         }
        //     },
        //     {
        //         title: "频道3",
        //         btype: "event",
        //         value: (e) => {
        //             console.log('this is 频道3 event !!!');
        //         }
        //     }
        // ];
        // this.setData({
        //     topBtns: topBtns
        // });
        // 获取活动数据,并载入新闻列表组件

    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    /**
     * 加载活动列表,通过社团id,null为所有社团
     */
    loadActivityList(clubId) {
        // 调用加载活动的接口

    }

})