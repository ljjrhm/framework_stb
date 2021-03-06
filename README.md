# framework_stb
- 版本号：v2.0.0
- 最后编辑时间：2018年6月8日 13点58分
- 作者联系方式：QQ 442331311
- 面向机顶盒开发的框架库 相对完善的底层库封装以及常规业务解决方案并持续更新中...

## 特性
### 使用 Framework_stb 框架可以使项目支持加载海量NPM包(待实现...)
### 支持 ES6/ES7标准代码，且可生成任意版本，使用async/await/promise能够有效避免回掉地狱
### 组建重用，对基础javascript代码进行封装，实现组件重用和嵌套一切皆为组件化
### 自动化命令，通过命令快速创建完整页面结构以及各类文件
### 支持 Bootstb 界面框架快速搭建界面结构已各类组件
### 配置完善的 snippet 代码片段(vs code)包括 html typescript less 语言的组件一键生成

## 初始化项目
### npm run start   // 开发流程
### npm run doc     // 框架文档
    
### gulp page --页面名称   // 创建页面
### gulp model --文件名称   // 创建文件
### gulp logic --文件名称   // 创建文件

## BASE
### UI框架
### 常规数据算法（页面来源、对象扩展、URL解析、格式化URL、克隆、日期格式化、范围随机与百分比抽奖）
### Ajax
### 事件代理
### 数据结构
### 焦点引擎
### 数据缓存
### 需求模块化
### 分页组建
### Cookie
### SetTimeout 计时器
### SetInterval 计时器
### FuncLock 函数截流
### KeyCode 键码

## Component
### 页面功能模块化
### 走马灯
### 左右翻页自动缓存；自动焦点
### 上下翻页自动缓存；自动焦点
### 可视区内容滚动
### 播放器；解决绝大部分盒子常规差异；基于 pageEvent 的事件交互方式

## 项目目录结构

├─dist                      // 输出目录
│  ├─css
│  ├─images
│  └─js
│      ├─framework          
│      │  ├─data_tool
│      │  └─ui_tool
│      ├─logic              
│      └─model              
├─doc                       // 文档资料
└─src                       // 源文件
    ├─framework             // 框架文件
    │  ├─data_tool
    │  └─ui_tool
    ├─less
    ├─logic                 // 数据逻辑
    ├─model                 // 数据实体
    ├─pages                 // 页面文件
    │  └─index
    └─template              // 模板文件

## 配置开发工具
### 项目初始化后使用 Visual Studio Code 或其他习惯IDE打开项目根目录。

## 开发流程
### 在 Visual Studio Code 或其他习惯IDE中编辑 src 目录下源码，然后在项目根目录运行 npm start 命令构建项目，然后再运行 npm server 命令启动静态资源服务自动弹出窗口预览
### 项目研发中，html 视图构建首选方案为 bootstrap 布局;Less 编写 css 样式;TypeScript 进行业务逻辑处理
#### Tips：编程思路核心突出体现强类型与模块化方案

# Less 框架结构（Bootstrap v3.3.7）
    通用 CSS
        Print media styles
        Typography
        Code
        Grid system
        Forms
        Buttons
        Responsive utilities
    组件
        Navs
        Thumbnails
        Alerts
        List groups
        Panels
    JS组建
        Tabs
        Progressbar

# 盒子与浏览器差异（重要）
- 盒子关机后 cookie 清空
- IPTV规范针对 JavaScript 扩展 API 不要通过闭包或 require 加载，出现接口无法访问问题
- 安徽-海信-ZP906H 盒子全局 top 属性作为 js 关键字。再次声明或赋值操作为无效。尽可能不要使用该关键字 top
- 数码视讯 Q5 小窗视频会覆盖所有元素背景图片样式；添加 背景图片可能导致屏幕部分黑屏（图片相关使用 img 标签）
- 创维 E900 返回简码与其它盒子不一致 Key.Backspace2且隐藏视频接口 this.mediaPlay.setVideoDisplayMode(255)无效
- APK 暴露的方法不要使用 let var 去定义 否则导致为空
- line-height 居中文字盒子展示有差异,使用 padding + font-size 代替 line-height 高度
- 部分盒子加载超长图片会失真模糊，浏览器自动降低图片分辨率进行下载，解决方案拆分成多个
- 绝大部分盒子默认背景色为黑色
- 烽火盒子背景图片切换会闪动；使用 visibility 代替 display:none 方式来显示图片;Velocity.js 插件导致的兼容性问题
- 播放影片部分可以播放 驻地网络 DHCP与 PPOE 可能导致网络不一样
- 烽火盒子 window.onkeydown 有时会失效推荐使用 document.onkeydown 还无法解决在页面加载主动 window.focus() 该盒子对于已经访问过页面貌似会抽风，需要主动激活
- 使用 Player 组建；创维中兴 调用频道播放直播流 A B 页面频繁切换时需注意 创建与播放 MediaPlayer 实例的间隔。可导致 无法播放问题。解决方案。在 A B 页面不要释放播放器。可重复创建 MediaPlayer 实例
- 创维E8205 在 A 页面创建播放器没有释放情况到 B 页面进行播放 这时 Backspace 被系统阻止.释放播放器后可恢复该异常
- ES5 特性不要使用 default 导出 低版本内核实现 default 会报错，比如IE 8及以下也可使用下面一条处理方式
- 生成 ES5 代码时由于盒子环境不支持部分 ES5 标签因此需要我们转换为 ES3 webpack 配置 es3ify-loader 加载器可解决这个问题
- 不可使用 a 标签，除非你完全清楚他在不同盒子的表现。通常 a 标签是默认的且可受 按键操控(移动、确认) 大部分情况下这个并不是我们需要的
- 盒子调试可配置 ie8 环境。该环境都能正常运行基本可保证盒子可运行。目前 4k 盒子比 ie8 兼容还要好一些比如 ie8 中报错的 Object.defineProperty 在盒子基本能正常运行
- 烽火盒子对 BUG 绝对敏感，遇到烽火盒子不能运行其他盒子可以运行情况，最佳方式抓 ADB 日志。绝大部分可能性是程序运行时调用到空对象(大部分盒子会忽略这种错误))


# v1.0.0 存在BUG与优化建议
- PageEvent 自定义模块 Focus 事件注册后提示注册的信息失效（偶发情况）.应该是多个Focus 实例化同一个实例，加入单例模式解决 --(v2.0.0 已经解决)
- Focus 对象 autoFile autoTarget 属性兼容性，后者会影响前者状态（目前最好不要同时配置两个属性）
- ModulePage 分页左右无法缓存问题（偶发）
- Player 目前不支持直播流，因为无法获取总时长因此卡顿超过 3 S会误判播放结束

# v2.0.0 设计思路
## 解决痛点
### EPG 页面与常规 Web 开发难度在于需要大量逻辑处理焦点运动规则。
- 增加 AUTOFocus 模块 到 UITool（插件）
- Focus 算法更改为阴影算法，兼容不规则图形。取消根据矩阵参数获取，仅 index 标识 和相对左右位置获取
- Focus 单利模式，支持多次实例化
- page 文件夹加文件 interface.ts 分离页面接口
- difference 算法 更新 DAM 节点
- PageEvent 触发返回 false 冒泡
- 将 interface 定义声明到当前目录且仅作用于当前目录
- 绘制静态页面 》 划分大模块 》 将静态渲染转换为模块渲染 》 将大模块转换小模块与静态组件 》 为小模块添加参数 》 为大模块天津状态 》 编写通信交互 》 编写业务逻辑
- 组建必须拥有父容器，否则无法解析 | 子父节点暂时无法实现
- Page Event 判断 handlers 需要便利内容，而不是下标。如果传入模块为 handlers 长度以上，就会提示没有加入订阅处理列表
- 缓存从API接口处处理，彻底与逻辑分离
- 修改 renderPre 支持 返回 promise 将同步转换为异步 如果数据还没返回 ，当前状态已经改变也会有问题 需要进行 state 验证
- 完善类选择器，多类不能选中问题
- 下翻页 disable 没有触发
- Cookie 改过期时长
- STB 开发模式 状态从 Page 根模块下发，方便恢复
- v2.0 版本构建新特性（重构模块、重构模块扩展交互、重构业务流程、重构数据流程、重构焦点引擎）
- 完善 Helement 构造函数传入标签 input 无法获取。children 兼容多个类名获取。构造函数封装 createElement 功能
- - Focus 模块 Demo 说明手动触发模拟按钮事件方式以及应用场景setSite(keyCode,"common") demo 介绍
- Demo 说明 Focus 主动触发一个模块的按钮事件，通过 pageveType.keydown 触发为例。不要直接使用 siteSite 方法。
- 需要改进 Focus 组建，模拟事件触发功能。Change事件触发可带参数 配置说明
- 事件批量注册功能 DEMO 说明
- Model on 事件 DEMO 说明
- 快速创建文件命令 page 命令 页面 default 变量自动替换与页面相关变量
- 需要改进：优化 HELEment .className 多个类名时无法获取情况
- webpack 文件再度细分
- 结构调整
- 兼容直播
- 
# webpack
- 发布版本 去除注释 压缩 css 前缀自动补全 sourceMap

# 更新日志
**2017年9月5日11:33:59**
- √ PageEvent 对象 trigger 方法进行焦点移交时若目标模块没有订阅加入异常提示
- √ PageEvent 对象 on 方法订阅 focus blur keydown 等事件选项封装为枚举类型且可扩展
- √ EventMeitter 对 Mediator 中介器封装，新增 EventMeitter 发射器代替(可支持同一事件被多个地方订阅)
- √ PageEvent 移除 system.${ele.topic}.${targetName} 订阅方式 改用发射器订阅。执行顺序为模块封装的自动行为执行（比如Focus对象）
- √ PageEvent 增加初始化时 targetName 属性可以为 null 意思是当前页面无焦点。然后通过 target 方法在需要地方手动设置
- √ EventMeitter 加入队列管理事件执行队列与顺序（发射器）
- √ PageEvent 定义日志打印接口并且实现相应逻辑，订阅 * - PageEventType.Error 通过浏览器函数 console.log() 输出日志
**2018年1月4日18:07:46**
- √ PageEvent 发布当前触发事件简码事件。订阅 PageEventType.keydown 事件可以替换为 Key 枚举的值
- √ PageEvent 管理模块可以有开关功能，如果关闭则自动焦点和焦点移交则不会执行
- √ pageEvent 焦点模块列表禁用功能，如果开启则自动排除该模块，不会执行焦点转移
- √ pageEvent 焦点模块列表锁定功能，如果开启该模块仅启用离开事件与焦点事件，不通知具体事件
- √ pageEvent 完整性检查，如果该对象不能接受到事件那么则取消该行为，以免让页面陷入失焦状态。从而让页面死掉
- √ Focus 对象卸载时可保存订阅的事件。重新创建时可以不用重复在订阅，事件可重用
- × Focus 相关事件触发源是自动触发还是主动调用方法触发的标注，特别是处理订阅事件和回掉的时候
- **2018年1月11日15:32:56**
- Helement 对象 removeClas,clas 方法导致前后空格，删除异常（类名中某个字符被删除）等问题
- PageEvent 新增 getPreviousIdentCode 方法获取来源模块标识
**2018年1月24日15点03分**
- 新增 template 文件夹 模板文件单独放置且跳过编译配置
- gulpfile.js 增加css多浏览器兼容
- gulpfile.js 增加html压缩
- gulpfile.js 增加图片压缩
- npm 编译命令增加 npm minify(发布压缩版本、带前缀css版本)
**2018年1月26日 14点07分**
- pageEvent 新增键码锁定功能在原有功能增加可选参数 lockTopic(identCode: number, keyCodes?: number[]) 
- pageEvent 锁定 lockTopic：identCode 所有键码。keyCodes 锁定给定键码
- pageEvent 解锁 unlockTopic：identCode 所有键码。keyCodes 解锁给定键码
**2018年2月1日 14点37分**
- ParseUrl 新增 decodeURI 与 decodeURIComponent 解码类型接口
- FormatUrl 新增 encodeURI 与 encodeURIComponent 加密类型接口
**2018年2月5日 10点24分**
- Player FinishPlay 事件完善（存在播放开时多次触发该事件）
- Player 完善播放进度兼容问题（部分盒子当前进度播放完成于总进度差距3秒左右误差）
- ParseUrl 与 FormatUrl 增加两种编码加密与解密接口
**2018年2月8日 10点57分**
- 更新 const.ts 更新部分盒子的配置情况
- 更新 player.ts 取消了音量设置延迟的功能
- Focus 完善 autoTarget: [{ keyCode: Key.Left, target: ModuleType.Anwser }] 支持 enter backspack 按键
- template.ts 更新更完善的初始页面
**2018年2月24日 11点03分**
- 更新 dataTool Key 对象新增 Home = 181 Pause = 263
**2018年2月26日 17点22分**
- 修复 Focus 第二次调用 initData 方法后 autoFile 的 Key.Right 和 Key.Left 异常问题
**2018年3月8日 09点35分**
- 更新 uiTool 工具库新增 VerietyRoll 模块
- 更新 config 配置文件结构与属性命名
- 更新 managementPageDB.ts 文件 修复分页容易产生歧义参数 删除 ManagementPageDBToLocal 模块 新增 ManagementPageDBToNative 模块作为替代
- 更新 dataTool 工具库 ParseUrl 对象 支持传入完整格式的 url 与 location.search
- 更新 dataTool 工具库 JSON 对象为静态对象使用不需要实例化
- 更新 focus 对象 优化部分功能
- 更新 pageEvent 对象 优化部分功能
- 更新 const 支持 云南盒子首页地址获取
- 更新 PageSource 修复cookie 对象返回 null undefined 异常
- 更新 Player 对象 支持自定义总时长 自定义总时长播放完毕后结束视频流
- 更新 Player 自动初始化当前系统音量
- 更新 Player 公开化 mediaPlayer 属性
- 更新 dataTool 模块 新增 Key.Mute2 云南静音键
- 更新 完整的各个模板文件
- 更新 uiTool 工具库 常用插件提取 比如（纵向自动滚动、自定义走马灯、可控制上下滚动查看）
- 更新 uiTool 走马灯逻辑调整给予 js 计时器实现
**2018年3月9日 11点23分**
- 更新 Player 快件到终点然后续播导致当前进度异常问题
**2018年3月12日 10点54分**
- 删除 carousel.ts 文件
- 删除 arithmetic.ts 文件
**2018年3月22日 14点19分**
- 更新 module 模块 增加基于 Module 模块扩展 ModulePage 对象支持播放底部选集翻页组件列表翻页组件
- 更新 interfaces.ts 增加 IManagementDB<T> 接口定义
- 更新 paging.ts 增加 getSerial 方法
- 更新 focus 模块 增加 getSetting 方法
- 更新 player 模块 增加 getTotal 方法
**2018年3月30日 17点56分**
- 更新 teleplay.ts 新增 recoverPage 恢复页面方法
- 增加 ModulePage 基类支持以 ModuleType 值为参数的多组数据提供前后翻页、上下翻页、自动缓存、智能焦点、全局焦点、全局序号设置焦点、分页下标设置焦点等方法
**2018年4月13日 10点36分**
- 更新 ModulePage 修复已知 bug
- 更新 uiTool.ts 新增 VerticalRoll、VerticalFlowRoll、VerticalVisualRangeRoll 、HorizontalRoll 模块
- 更新 framework.ts
- 更新 Helement 模块 支持直接关系选择器（类选择器、ID选择器、节点类型选择器）筛选子节点
- 更新 PagingHelper 模块
- 更新 PageEvent 模块 扩展 on off 方法支持批量处理;
- 更新 Focus 模块 删除 FocusType.Focused FocusType.Blured 事件
- 更新 Module 模块 新增基于 PageEvent 模块的事件订阅方式 且提供回掉参数强类型支持
- 更新 interface.ts 删除 IPageEvent 接口 调整各事件类型属性成员
- 更新 Player PlayerSpecial 播放器进度改变事件回调中增加总时长属性;总时长初始化事件回调加当前进度参数
- 更新 简化编码复杂程度（ModulePage、）
- 增加 Gulp 命令创建完整页面结构（.html、.less、.ts、logic.ts、entity.ts）
**2018年4月16日 10点44分**
- 更新 Focus 模块 setSite 方法（设置坐标）如果当前焦点非当前模块时不做添加样式操作;调整 initData 参数为 HElement 对象
- 更新 Helement 模块 API接口参数调整;支持链式调用;支持子节点筛选（类选择器、ID选择器、节点类型选择器）
**2018年4月18日 11点39分**
- 更新 Focus 模块兼容非矩形焦点组
- 新增 layout 布局框架引入定制版 Bootstrap 通用样式 组件样式（导航、缩略图以及自定义缩略图样式、警告框、进度条（自己去实现，作为JS组建）、列表组（以及加徽章或者图标）、tabs（自己实现，作为js组件）、徽章、媒体对象
**2018年5月9日 16点37分**
- 新增 /src/package 目录 作为发布文件补充目录 启动编译时自动将图片或其他资源输出到 dist
**2018年5月14日 10点02分**
- 预定义 CSS .init() .default() .focus() 样式函数 分别应用 重置 焦点默认 焦点样式
**2018年6月7日 09点43分**
- 新增 es6-promise.auto.min.js 引入 Promise 开发模式
- 更新 template 系列模板文件 template.ts 定义多组 Module (普通组件、翻页组件)
- 更新 ModulePage 完善强类型支持
- 更新 tsconfig.json 支持 Promise 模式
- 更新 HElement 对象扩展 getAll() 方法 eqAll() 方法
- 更新 interface.ts 各类型属性成员
- 更新 ManagementPageDB 模块无法缓存多页数据BUG;getItem 方法支持返回 Promise 对象
- 更新 HorizontalRoll 首次 enable 无法正常滚动到指定位置
- 更新 Focus 模块 新增 guid 属性 在跨行跨列作为通用属性，参考 Focus 对象 debuggerOut 方法
- 更新 Focus 对象 release 方法卸载队列完整性
- 更新 framework.ts
- 更新 ModulePage 模块 onDBLoadList 回掉中使用异步读取数据导致数据异常与 loadView 数据不一致等问题
- 更新 ModulePage 模块 支持返回 Promise 实例
- 更新 Module 模块 新增 RecoverStatus 方法，恢复组建状态
- 更新 template.ts 定义 reutrn 请求参数作为返回来源页地址
- 新增 自定义代码片段(Vs Code)
- 更新 HorizontalVisualRangeRoll VerticalFlowRoll 模块支持初始设置偏移以及改变时可自定义过渡效果
- 更新 Player 订阅 onfocus 事件避免事件异常
- 更新 package 文件夹引入 velocity.min 插件

# 应用项目
- 安徽文艺（2017）
- 内蒙环球（2017）
- 云南4k（2017）
- 安徽猜灯谜（2018）
- 安徽送祝福（2018）
- 内蒙天翼（2018.3）
- 安徽聚合（2018.5）
- 云南618（2018.6）
- 安徽世界杯活动（2018.6）
- 陕西少儿（2018.7）

# 设计思路
    单一职责
        单一职责的描述如下：
        A class should have only one reason to change
        类发生更改的原因应该只有一个

        dataTool.ts 基础库
        整个体系中最小单位对象。仅有一个或一组紧密相关的行为为一个主题服务。通过解耦使每个职责更加有弹性的变化

        focus.ts 焦点对象
        职责是初始化一组矩阵焦点与页面焦点映射关联。且具备一组对该矩阵图相关的职责属性方法

        model 系列对象
        实体类主要是作为数据管理和业务逻辑处理层面上存在的类别;
        某个实体对象可与另一个实体对象关联，但他们都遵循单一职责，每个实体对象的定义都应该围绕一个主题且属性不可再分

        ...

    开闭原则
        开闭原则的描述如下：
        Software entities (classes, modules, functions, etc.) should be open for extension but closed for modification.
        软件实体（类，模块，方法等等）应当对扩展开放，对修改关闭，即软件实体应当在不修改的前提下扩展。

        pageEvent.ts 事件管理对象
        采用事件订阅模式，也称观察者模式。同时也是 MVC 框架中各模块间通信的中间对象，订阅者仅关心在处理地方订阅并处理即可。增加其他事件类型也不用修改源码而只是订阅新的事件（Key、PageEventType、FocusType等等）。

        ...

    里氏替换原则
        里氏替换原则的描述如下：
        Subtypes must be substitutable for their base types.
        派生类型必须可以替换它的基类型。 

        module.ts 系列模块
        将页面所有焦点元素作为一个或多个模块进行管理 Module 对象作为基类为模块提供基本约束 initialize 和 subscribeToEvents 子类实现这两个方法实现对 pageEvent 订阅和处理相关业务逻辑。在此基础上可实现更为复杂的 Module 模块作为基类被子类继承，但未子类提供处理更复杂业务的能力

        ...
    
    接口隔离原则
        关注接口而不是关注数据
    
    依赖反转原则

    工厂模式
        描述如下：
        与创建型模式类似，工厂模式创建对象（视为工厂里的产品）时无需指定创建对象的具体类。

        工厂模式定义一个用于创建对象的接口，这个接口由子类决定实例化哪一个类。该模式使一个类的实例化延迟到了子类。而子类可以重写接口方法以便创建的时候指定自己的对象类型。

        这个模式十分有用，尤其是创建对象的流程赋值的时候，比如依赖于很多设置文件等。并且，你会经常在程序里看到工厂方法，用于让子类类定义需要创建的对象类型。

# 常规协议
## HTTP
### 网页、资源(js、css、html等)、点播流
## TCP
### 未知
## UDP
### 视频流
## RTSP
### 直播流更具轻量级

### 注意：
#### 由于盒子环境不支持ES6语法，处于兼容性考虑默认页面导入 es6-promise.auto 以支持 promise