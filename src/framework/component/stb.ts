import { PageEvent, PageType } from "./pageEvent";
import { HElement } from "../basic/helement";
import { Key } from "../basic/key";
import { Site } from "./focus";
import { Json } from "../basic/json";
import { PageSource } from "./pageSource";
import { Cookie } from "../basic/cookie";
import { ParseUrl } from "../basic/parseUrl";
import { FormatUrl } from "../basic/formatUrl";
import { Position } from "../basic/position";

// 有效实例记录（单例模式）
let instances: { instance: any, create: number }[] = [];

class Component<P, S> {
    protected event: PageEvent;
    protected state: S & { index: number };
    protected readonly props: P;
    private readonly setting: IComponent;
    private container: HTMLElement;
    public readonly element: IHElement;

    private readonly _render = (con: HTMLElement) => {

        // 首次必须挂载
        if (con) {
            this.container = con;
        }

        this.__renderPrepare().then(() => {

            let html = this.render();
            if (con) {
                this.container = con;

                if (this.container) {
                    this.container.innerHTML = html;
                }
            }
            this.__initFocus(this.container);
            this.renderComplate();
        });
    }
    private readonly _init = () => {
        this.initialize();
        this.subscribeToEvents();
    }
    // _ 程序调用 __ 事件调用
    private readonly __initFocus = (container: HTMLElement) => {

        const { identCode } = this.setting;

        if (container) {

            // 是否拥有子节点
            let con = new HElement(container);
            if (con.length) {

                (<any>this.element) = con.find("[tag=focus]");

                this.setFocus(this.state.index);
            }
        }
    }
    private readonly __renderPrepare = (): Promise<void> => {
        return this.renderPrepare();
    }
    constructor(props: P, set: IComponent, e: PageEvent) {
        // 订阅组建
        let identCode = set.identCode;

        this.setting = set;
        this.props = props;
        this.event = e;

        e.on(identCode, PageType.Focus, (e: FocusEvent) => {
            this.setFocus(this.state.index);
        })
        e.on(identCode, PageType.Blur, (e: FocusEvent) => {

            // 针对 index 单独处理，不需要刷新视图 与 SetFocus 代码基本一样
            const { className, leaveName, identCode } = this.setting;

            if (this.element && this.element.length && this.element.length >= this.state.index) {

                className && this.element.removeClass(className);
                leaveName && this.element.removeClass(leaveName);

                leaveName && this.element.eq(this.state.index).addClass(leaveName);
            }
        });
        // 上下左右
        e.on(identCode, PageType.Keydown, (e: IKeydown) => {
            // 是否禁用
            if (!this.event.hasDisable(identCode)) {

                // 上下左右
                if (Key.Up === e.keyCode || Key.Right === e.keyCode || Key.Down === e.keyCode || Key.Left === e.keyCode) {
                    let success = false, site: Site, pre = this.element.eq(this.state.index);
                    // 是否有效
                    site = area(this.element, this.state.index, e.keyCode);

                    if (site) {

                        this.setFocus(site.index);
                        success = true;
                    } else {
                        site = { element: this.element.eq(this.state.index), index: this.state.index };
                    }
                    this.event.trigger(identCode, PageType.Changed, <IChanged>{ site: site, success: success, fromSystem: false, keyCode: e.keyCode });
                }
            }
        });
    }
    public initialize() {
    }
    public subscribeToEvents() {
    }
    protected on(topic: string | number, callback: any) {
        this.event.on(this.setting.identCode, topic, callback);
    }
    protected onfocus(callback: (e: IFocus) => void) {
        this.event.on(this.setting.identCode, PageType.Focus, callback);
    }
    protected onblur(callback: (e: IBlur) => void) {
        this.event.on(this.setting.identCode, PageType.Blur, callback);
    }
    protected onkeydown(callback: (e: IKeydown) => void) {
        this.event.on(this.setting.identCode, PageType.Keydown, (e: IKeydown) => {
            let ele = this.element.eq(this.state.index);
            if (ele) {
                let data = ele.attr('data-keydown');

                if (data) {
                    e.data = Json.deSerializ(data);
                }
            }
            callback(e);
        });
    }
    protected onchanged(callback: (e: IChanged) => void) {
        this.event.on(this.setting.identCode, PageType.Changed, (e: IChanged) => {

            let ele = this.element.eq(this.state.index);
            if (ele) {
                let data = ele.attr('data-changed');

                if (data) {
                    e.data = Json.deSerializ(data);
                }
            }
            callback(e);
        });
    }
    protected onenable(callback: (e: IEnable) => void) {
        this.event.on(this.setting.identCode, PageType.enableSite, (e: IEnable) => {
            callback(e);
        });
    }
    protected trigger(topic: string | number, data: any = null) {
        this.event.trigger(this.setting.identCode, topic, data);
    }
    protected setState(status: S & { index?: number }) {

        if (!this.state) {
            this.state = <any>status;
        } else {
            for (const key in status) {
                if (status.hasOwnProperty(key)) {
                    this.state[key] = status[key];
                }
            }
        }

        this._render(this.container);
    }
    protected setFocus(index: number) {

        // 针对 index 单独处理，不需要刷新视图
        this.state.index = index;

        const { className, leaveName, identCode } = this.setting;

        if (this.element && this.element.length > this.state.index) {

            className && this.element.removeClass(className);
            leaveName && this.element.removeClass(leaveName);

            if (this.event.getTargetIdentCode() === identCode) {

                this.event.trigger(identCode, PageType.enableSite, <Site>{ index: this.state.index, element: this.element.eq(this.state.index) });

                className && this.element.eq(this.state.index).addClass(className);
            } else {
                leaveName && this.element.eq(this.state.index).addClass(leaveName);
            }
        }
    }
    protected render(): string {
        return;
    }
    protected renderComplate() {
    }
    protected renderPrepare(): Promise<any> {
        return new Promise((resolve) => {
            resolve();
        });
    }
}
class STBDom {
    public static render<P>(m: any, props: P, set: IComponent, e: PageEvent, c: IHElement): void {
        if (undefined === set.identCode) {
            new Error("not found identCode");
            return null;
        } else {
            let inst = instances[set.identCode];

            if (inst) {
                inst.create++;
                // console.log("已经创建");
                inst.instance.event = e;
                inst.instance.props = props
                inst.instance.setting = set;

                // 加载组件
                inst.instance.initialize();

                m = inst.instance;
            } else {
                // console.log("新建");
                m = new (<any>m)(props, set, e);
                instances[set.identCode] = { instance: m, create: 1 };

                (<any>m)._init();
            }
        }

        (<any>m)._render(c && c.get(0));
    }
}
class STB {
    static Component = Component;
    /**
     * 仅接受原始类型
     */
    static props = function (params: { [key: string]: string | number | boolean }): string {
        return Json.serializ(params);
    }
    static area = area;
    static scope = scope;
}
interface IPage<IRqeuest, P, M> {
    readonly source?: PageSource;
    readonly cokStatus?: Cookie;
    readonly request?: IRqeuest;
    readonly event?: PageEvent;
    initData?(request: IRqeuest, memo: M): Promise<any>;
    subscribeToEvents?();
    openBlank?(url: string);
    entrancePage?(request: IRqeuest, memo: M);
    recoverPage?(memo: M);
    openBefore?(url: string, params: P, memo: M): string;
    previousBefore?(): string;
}
class PageBase<IRqeuest={ return: string }, P=any, M=any> {
    protected source: PageSource;
    protected cokStatus: Cookie;
    protected request: IRqeuest & { return: string };
    protected event: PageEvent;

    constructor(pageName: string, handler: number[], setting: IPage<IRqeuest, P, M>, debug?: { debug?: boolean, other?: boolean }) {
        if (setting.initData) {
            this.initData = setting.initData;
        }
        if (setting.subscribeToEvents) {
            this.subscribeToEvents = setting.subscribeToEvents;
        }
        if (setting.openBlank) {
            this.openBlank = setting.openBlank;
        }
        if (setting.entrancePage) {
            this.entrancePage = setting.entrancePage;
        }
        if (setting.recoverPage) {
            this.recoverPage = setting.recoverPage;
        }
        if (setting.openBefore) {
            this.openBefore = setting.openBefore;
        }
        if (setting.previousBefore) {
            this.previousBefore = setting.previousBefore;
        }

        this.source = new PageSource(`${pageName}_source`);
        this.cokStatus = new Cookie(`${pageName}_status`);
        this.request = new ParseUrl(window.location.search).getDecodeURIComponent();
        // 兼容陕西盒子 backUrl
        this.source.saveToLocal(this.request.return || "-1");

        this.event = new PageEvent(null, [
            {
                topic: PageType.Keydown, data: null, handler: handler
            }
        ], (debug && debug.debug) || false, (debug && debug.other) || false);

        let memo = Json.deSerializ(this.cokStatus.getCookie());
        this.entrancePage(this.request, memo);

        this.initData(this.request, memo).then(() => {
            this.subscribeToEvents();
            this.recoverPage(memo);
        });

        this.event.on(handler, PageType.Previous, () => {
            let url = this.previousBefore();
            if (undefined !== url) {
                this.openBlank(url);
            }
        });
        this.event.on(handler, PageType.Blank, (params: { url, params, memo }) => {

            let url = this.openBefore(params.url, params.params, params.memo);

            this.openBlank(url);
        });
    }
    initData(request: IRqeuest, memo: M): Promise<any> {
        return new Promise((resolve) => {
            resolve();
        });
    }
    subscribeToEvents() {
    }
    openBlank(url: string) {
        if (url) {
            window.location.href = url;
        }
    }
    entrancePage(request: IRqeuest, memo: M) {
    }
    recoverPage(memo: M) {

    }
    openBefore(url: string, params: P, memo: M): string {
        this.cokStatus.setCookie(Json.serializ(<any>memo));
        if (params) {
            return new FormatUrl(url, params).getEncodeURIComponent();
        } else {
            return url;
        }
    }
    previousBefore(): string {
        let url = this.source.takeToLocal();
        this.cokStatus.clearCookie();
        this.source.removeToLocal();
        return url;
    }
}
function Page<IRqeuest={ return: string }, P={}, M={}>(pageName: string, handler: number[], setting: IPage<IRqeuest, P, M>, debug?: { debug?: boolean, other?: boolean }) {
    return new PageBase<IRqeuest, P, M>(pageName, handler, setting, debug);
}
/**
 * 查找区域
 */
export function area(ele: IHElement, index: number, keyCode: Key.Up | Key.Down | Key.Right | Key.Left): Site {

    let eles: HTMLElement[] = ele.getAll(), list: { index: number, element: HElement }[] = [];

    eles.forEach((v, i) => {
        list.push({
            index: i,
            element: new HElement(v)
        });
    });

    let posis: { num: number, left: number, top: number, right: number, bottom: number, site: Site }[] = [], curPos = Position(ele.eq(index).get(0));

    // 确定方向
    if (Key.Up === keyCode) {

        // 找到范围有效
        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效顶部
            if (item.bottom <= curPos.top) {
                // 阴影检测
                if (shadown(curPos, item, Key.Up)) {
                    let x1 = curPos.left;
                    let x2 = item.left;
                    let y1 = curPos.top;
                    let y2 = item.bottom;

                    let num = distance(x1, x2, y1, y2);

                    posis.push({ ...item, site: v, num: num });
                }

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });

    }
    else if (Key.Right === keyCode) {

        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效右边
            if (item.left >= curPos.right) {
                // 阴影检测
                if (shadown(curPos, item, Key.Right)) {
                    let x1 = curPos.left;
                    let x2 = item.left;
                    let y1 = curPos.top;
                    let y2 = item.bottom;

                    let num = distance(x1, x2, y1, y2);

                    posis.push({ ...item, site: v, num: num });
                }
            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });

    }
    else if (Key.Down === keyCode) {
        // 找到范围有效
        list.forEach((v, i) => {

            let item = Position(v.element.get(0));
            // 有效底部
            if (item.top >= curPos.bottom) {
                // 阴影检测
                if (shadown(curPos, item, Key.Down)) {
                    let x1 = curPos.left;
                    let x2 = item.left;
                    let y1 = curPos.top;
                    let y2 = item.top;

                    let num = distance(x1, x2, y1, y2);

                    posis.push({ ...item, site: v, num: num });
                }

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });
    }
    else if (Key.Left === keyCode) {
        // 找到范围有效
        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效左边
            if (item.right <= curPos.left) {

                // 阴影检测
                if (shadown(curPos, item, Key.Left)) {

                    let x1 = curPos.left;
                    let x2 = item.left;
                    let y1 = curPos.top;
                    let y2 = item.bottom;

                    let num = distance(x1, x2, y1, y2);

                    posis.push({ ...item, site: v, num: num });
                }

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });
    }
    return posis.length ? posis[0].site : null;
}
/**
 * 查找范围
 */
function scope(ele: IHElement, index: number, keyCode: Key.Up | Key.Down | Key.Right | Key.Left): Site {

    let eles: HTMLElement[] = ele.getAll(), list: { index: number, element: HElement }[] = [];

    eles.forEach((v, i) => {
        list.push({
            index: i,
            element: new HElement(v)
        });
    });

    let posis: { num: number, left: number, top: number, right: number, bottom: number, site: Site }[] = [], curPos = Position(ele.eq(index).get(0));

    // 确定方向
    if (Key.Up === keyCode) {

        // 找到范围有效
        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效顶部
            if (item.bottom <= curPos.top) {

                let x1 = curPos.left;
                let x2 = item.left;
                let y1 = curPos.top;
                let y2 = item.bottom;

                let num = distance(x1, x2, y1, y2);

                posis.push({ ...item, site: v, num: num });

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });

    }
    else if (Key.Right === keyCode) {

        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效右边
            if (item.left >= curPos.right) {
                let x1 = curPos.left;
                let x2 = item.left;
                let y1 = curPos.top;
                let y2 = item.bottom;

                let num = distance(x1, x2, y1, y2);

                posis.push({ ...item, site: v, num: num });
            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });

    }
    else if (Key.Down === keyCode) {
        // 找到范围有效
        list.forEach((v, i) => {

            let item = Position(v.element.get(0));
            // 有效底部
            if (item.top >= curPos.bottom) {
                let x1 = curPos.left;
                let x2 = item.left;
                let y1 = curPos.top;
                let y2 = item.top;

                let num = distance(x1, x2, y1, y2);

                posis.push({ ...item, site: v, num: num });

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });
    }
    else if (Key.Left === keyCode) {
        // 找到范围有效
        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效左边
            if (item.right <= curPos.left) {

                let x1 = curPos.left;
                let x2 = item.left;
                let y1 = curPos.top;
                let y2 = item.bottom;

                let num = distance(x1, x2, y1, y2);

                posis.push({ ...item, site: v, num: num });

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });
    }
    return posis.length ? posis[0].site : null;
}
function distance(x1: number, x2: number, y1: number, y2: number) {
    let c = (Math.abs((x1 - x2)) * Math.abs((x1 - x2))) + (Math.abs((y1 - y2)) * Math.abs((y1 - y2)));
    return Math.sqrt(c);
}
function shadown(p1: { top: number, left: number, right: number, bottom: number }, p2: { top: number, left: number, right: number, bottom: number }, keyCode: Key.Left | Key.Up | Key.Right | Key.Down): boolean {

    if (keyCode === Key.Right || keyCode === Key.Left) {
        // 1. 顶点有效
        if ((p1.top <= p2.top && p1.bottom >= p2.top)) {
            return true;
        }
        // 2. 底点有效
        else if ((p1.top <= p2.bottom && p1.bottom >= p2.bottom)) {
            return true;
        }
        // 3. 身体部分有效
        else if ((p1.top >= p2.top && p1.bottom <= p2.bottom)) {
            return true;
        }
    }
    else if (keyCode === Key.Up || keyCode === Key.Down) {
        // 1. 顶点有效
        if ((p1.left <= p2.left && p1.right >= p2.left)) {
            return true;
        }
        // 2. 底点有效
        else if ((p1.left <= p2.right && p1.right >= p2.right)) {
            return true;
        }
        // 3. 身体部分有效
        else if ((p1.left >= p2.left && p1.right <= p2.right)) {
            return true;
        }
    }
    return false;
}
export { STB, STBDom, Page }