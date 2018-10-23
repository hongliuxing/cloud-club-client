// const HOST = "http://127.0.0.1:58888/";
// const HOST = "http://luv-ui.com:58888/";
const HOST = "https://she-u.cn:58888/";

// 登录接口
export const LOGIN = HOST + "access/login";

/***************************************
 * 
 * 【UPLOAD】 上传通用接口
 * 
 ***************************************/
// 手持学生证或身份证上传签名
export const UPLOAD_CLUB_PID = HOST + "upload/cloudclub/pid";
// 社团合影上传签名
export const UPLOAD_CLUBAPPLY = HOST + "upload/cloudclub/clubapply";
// 社团logo上传签名
export const UPLOAD_CLUB_LOGO = (clubid) => HOST + "upload/cloudclub/" + clubid +"/logo";
// 社团背景图上传签名
export const UPLOAD_CLUB_BGIMG = (clubid) => HOST + "upload/cloudclub/" + clubid +"/bgimg";
// 社团活动图的签名
export const UPLOAD_CLUB_ACTIVITY_PIC = HOST + "upload/cloudclub/activity";


/***************************************
 * 
 * 【user】 普通用户通用接口
 * 
 ***************************************/
// 获取个人面板资料数据（登录时查询并缓存）
export const USER_PANEL_INFO = HOST + "user/panel-info";
// 新增/修改个人信息
export const USER_SAVE = HOST + "user/save";
// 发送手机短信验证码
export const USER_PHONE_SMS = HOST + "user/phone-sms";
// 新增/修改手机号码
export const USER_PHONE_SAVE = HOST + "user/phone/save";

/***************************************
 * 
 * 【SCHOOL】 学校相关接口
 * 
 ***************************************/
// 获取推荐学校及学校列表
// 根据坐标定位获取学校位置，若无法获取则根据IP定位省市所表示的学校
// 省份城市, 将根据这里获取到的推荐学校定位, 来定位
export const SCHOOL_NEARBY_LIST = HOST + "school/nearby-list";
// 获取省份列表
export const SCHOOL_PROVINCE_LIST = HOST + "area/province-list";
// 获取城市列表
export const SCHOOL_CITY_LIST = HOST + "area/city-list";
// 新增学校设置申请
export const SCHOOL_SETTING = HOST + "school/setting";
// 根据城市code查询所对应的学校列表
export const SCHOOL_CITYLIST = HOST + "school/city/list";
// 查询当前用户最新的学校设置申请
export const SCHOOL_LOAD_APPLY = HOST + "school/load-apply";
/***************************************
 * 
 * 【activity】 活动相关接口
 * 
 ***************************************/
// 获取活动信息(简单)详情
export const ACTIVITY_SIMPLE_INFO = HOST + "activity/simple-info";
// 获取我参与的社团活动列表
export const ACTIVITY_CONCERNED_LIST = HOST + "activity/concerned-list";
// 获取当前活动的配图列表
export const ACTIVITY_PICS = HOST + "activity/pics";

// 获取活动相关的评论列表
export const ACTIVITY_COMMENTS_LIST = HOST + "activity/comments-list";
// 新增评论
export const ACTIVITY_COMMENTS_ADD = HOST + "activity/add-comment";

// 获取所有(全国开放性的)社团活动列表
export const ACTIVITY_PUBLIC_LIST = HOST + "activity/public-list";
// 获取我关注的( attention )社团活动列表
export const ACTIVITY_ATTENTION_LIST = HOST + "activity/attention-list";
// 获取自己学校的( SCHOOL )社团活动列表
export const ACTIVITY_SCHOOL_LIST = HOST + "activity/school-list";

/***************************************
 * 
 * 【club】 社团相关接口
 * 
 ***************************************/
// 获取我的社团列表
export const CLUB_SIMPLE_LIST = HOST + "club/simple-list";
// 获取详细社团列表
export const CLUB_DETAIL_LIST = HOST + "club/detail-list";
// 获取本校(可加入)社团列表
export const CLUB_SELF_CANAPPLY_LIST = HOST + "club/self/canapply-list";
// 获取申请加入社团的历史(申请单据)列表
export const CLUB_SELF_APPLY_LIST = HOST + "club/self/apply-list";
// 申请加入社团
// 同一时间对某社团的申请,可以有多个 -1(被拒绝状态), 但0(申请中) 和 1(已通过)只能有一个
export const CLUB_SELF_JOIN = HOST + "club/self/join";


// 查询社团联系人
// 按权限排序查询联系人,由前端控制如何对用户进行操作(升降权)
export const CLUB_CONTACT_LIST = HOST + "club/contact-list";
// 查询社团面板提示信息
// 包含公告提示、申请入社数据提示
export const CLUB_PANEL_TIPS = HOST + "club/panel-tips";
// 查看公告列表
export const CLUB_NOTICE_LIST = HOST + "club/notice-list";
// 查看社团资料
export const CLUB_DETAIL_INFO = HOST + "club/detail-info";


// 添加关注
export const CLUB_ATTENTION_ADD = HOST + "club/add-attention";
// 取消关注
export const CLUB_ATTENTION_CANCEL = HOST + "club/cancel-attention";
// 获取关注(社团)列表
export const CLUB_ATTENTION_LIST = HOST + "club/attention-list";
// 获取向我推荐的社团列表
export const CLUB_RECOMMEND_LIST = HOST + "club/recommend-list";

/***************************************
 * 
 * 【clubmaster】 社团管理者相关接口
 * 
 ***************************************/
// 获取创建社团申请列表
export const CLUBMASTER_BUILD_APPLY_LIST = HOST + "clubmaster/build-apply-list";
// 新增/创建社团
// 建立社团时需验证创建社团数量(不得大于5, 正在申请数量, 及作为团长的数量)
// 在申请中 / 审核通过的状态中, 是否在当前学校有重复名字的社团
export const CLUBMASTER_CREATE_CLUB = HOST + "clubmaster/create-club";
// 新增公告
export const CLUBMASTER_NOTICE_ADD = HOST + "clubmaster/notice/add";
// 删除/撤销公告
export const CLUBMASTER_NOTICE_REPEAL = HOST + "clubmaster/notice/repeal";
// 查询申请入社列表
export const CLUBMASTER_JOIN_LIST = HOST + "clubmaster/join-list";
// 社团申请: 批准
// 弹框显示, 已批准XXX入团
// 当审核通过时, 更改club_apply表的申请状态, 及添加用户至club_contcat中
export const CLUBMASTER_JOIN_RATIFY = HOST + "clubmaster/join-ratify";
// 社团申请: 拒绝
// 下拉提示拒绝理由输入框, 点击按钮后拒绝
export const CLUBMASTER_JOIN_REJECT = HOST + "clubmaster/join-reject";
// 社团联系人: 升降权
// 升权: 只能提升级别差大于等于2的角色(4可以把2提升至3, 但不能把3提升至4)
// 降权: 只能降权级别差大于等于1的角色, 但不能降级为0以下。（3可以降级2, 但不能降级3, 也不能降级至 - 1）
// 升降权记录: 需做历史记录(保留三个月内)
export const CLUBMASTER_SET_POWER = HOST + "clubmaster/set-power";

//修改社团资料

export const CLUBMASTER_MOFIFY_CLUB = HOST + "clubmaster/modify-club";

// 已发布: 查询结果与活动列表中的社团活动查询结果一致
// 审核中 / 待发布: 查询简单结果
export const CLUBMASTER_ACTIVITY_LIST = HOST + "clubmaster/activity-list";

// 管理活动:删除oss配图
// 手动删除配图
// 退出编辑界面删除多个配图
export const CLUBMASTER_ACTIVITY_DELETE_IMGS = HOST + "clubmaster/activity/delete-imgs";

// 管理活动: 保存
// 进入社团面板时, 缓存当前所在的社团名称和id, 此处获取
// 离开页面, 则删除oss中上传的配图
// 保存之后还需要发布
export const CLUBMASTER_ACTIVITY_SAVE = HOST + "clubmaster/activity/save";

// 管理活动: 发布
// 待发布阶段, 若修改, 则需要重新保存, 发布按钮变灰
export const CLUBMASTER_ACTIVITY_PUBLISH = HOST + "clubmaster/activity/publish";

// 管理活动: 撤销
// 撤销后, 变为待审核0状态
export const CLUBMASTER_ACTIVITY_REPEAL = HOST + "clubmaster/activity/repeal";