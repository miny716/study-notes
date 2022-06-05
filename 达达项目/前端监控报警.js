/**
 * =====背景
 * 1、原有的监控报警只有对js错误进行报警，缺少其他异常情况的监控报警；
 * 2、大家对于线上问题缺少感知，对前端的监控也缺少关注度
 * 
 * =====目标
 * 利用现有的监控SDK，完善前端监控报警体系；提高前端同学对监控的关注度
 * 
 * =====行动
 * 确定监控指标（异常监控、性能监控、业务监控）
 * 1、异常监控（前端静态资源加载失败、JS错误、接口请求异常2种）
 * 2、性能监控（页面完全加载时间）
 * 3、业务监控（系统PV、UV、通过埋点实现的其他业务操作监控）
 * 
 * =====成果
 * 洪流系统前端监控报警，由最初的1个JS错误监控面板，到目前的9个监控面板。比较全面地监控项目的异常情况以及运行状态
 * 
 * =====异常监控场景
 * 1、ng静态资源报警4次：ops构建发包错误上；静态资源机器消失；线上配置url错误导致404
 * 2、接口层面的报错：接口超时、后端空指针异常、触发WAF层爬虫拦截
 * 3、JS错误报警：js边界错误、灰度期间观察监控发现undefined错误
 */

