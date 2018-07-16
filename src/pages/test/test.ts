/**
 * 编辑作者：张诗涛
 * 创建时间：2018年4月12日 21点45分
 * 功能分类：Focus 模块使用示例
 */
import { Focus, FocusType, PageEvent, PageType, HElement, Key, Json, Random, Site } from "../../framework/framework";

enum MType {
    Left
}

let pageEvent = new PageEvent(MType.Left, [
    {
        topic: PageType.Keydown, data: null, handler: [
            MType.Left
        ]
    }
], true);

let eleTips = new HElement('#tips');

// let focLeft = new Focus({
//     identCode: MType.Left,
//     width: 5,
//     className: "focus"
// }, pageEvent);

// focLeft.initData(new HElement("#con-lf").children("div"));
// 有效实例记录（单例模式）
const instances: number[] = <any>{};

class Component<P={}, S={}> {
    protected event: PageEvent;
    protected state: S;
    protected props: P;
    public readonly foc: Focus;
    private readonly icom: IComponent;
    private readonly container: HTMLElement;

    constructor(props: P, icom: IComponent, e: PageEvent) {
        let inst = instances[Number(icom.identCode)];

        if (inst) {
            console.log("已经创建")
            return <any>inst;
        } else {
            console.log("新建")
            instances[Number(icom.identCode)] = <any>this;
        }

        console.log("执行")

        // TODO
        this.event = e;
        this.props = props
        this.icom = icom;
        this.foc = new Focus(icom, e);
    }
    public initialize() {
    }
    public subscribeToEvents() {
    }
    protected on(topic: string | number, callback: any) {
        this.event.on(this.icom.identCode, topic, callback);
    }
    protected onfocus(callback: (e: IFocus) => void) {
        this.event.on(this.icom.identCode, PageType.Focus, callback);
    }
    protected onblur(callback: (e: IBlur) => void) {
        this.event.on(this.icom.identCode, PageType.Blur, callback);
    }
    protected onkeydown(callback: (e: IKeydown) => void) {
        this.event.on(this.icom.identCode, PageType.Keydown, (e: IKeydown) => {
            e.data = Json.deSerializ(this.foc.getSite().element.attr('data-keydown') || "{}");
            callback(e);
        });
    }
    protected onchanged(callback: (e: IChanged) => void) {
        this.event.on(this.icom.identCode, FocusType.Changed, (e: IChanged) => {
            e.data = Json.deSerializ(e.site.element.attr('data-changed') || "{}");
            callback(e);
        });
    }
    protected setData(status: S) {
        this.state = status;
        this.container.innerHTML = this.renderView();

        // 焦点状态
        let focStatus = {
            site: this.foc.getSite(),
            isFoc: this.event.getTargetIdentCode() === this.icom.identCode
        }

        this.foc.initData(this.renderFocus());

        // 恢复焦点状态
        let ele = this.foc.getSite().element;

        if (focStatus.isFoc) {
            this.foc.setSite(focStatus.site);
        }
    }
    public renderView(): string {
        return null;
    }
    public renderFocus(): IHElement {
        return null;
    }
}
class STBDom {
    public static render(m: Component<any, any>, props: any, c: HTMLElement) {
        m = new (<any>m)(props);
        // 初始化
        m.initialize();
        // 订阅
        m.subscribeToEvents();
        // 渲染
        c.innerHTML = m.renderView();
        // 绑定容器
        (<any>m).container = c;
        // 焦点
        m.foc.initData(m.renderFocus());
    }
}
class STB {
    static Component = Component;
    static ComponentDom = STBDom;
    /**
     * 仅接受原始类型
     */
    static props = function (params: { [key: string]: string | number | boolean }): string {
        return Json.serializ(params);
    }
}
class ListModule extends STB.Component<{ age: number }, { name: string }> {
    constructor(params: any) {
        super(params, {
            identCode: MType.Left,
            className: "focus",
            width: 5
        }, pageEvent);

        this.state = {
            name: "zst"
        };
    }
    subscribeToEvents() {
        this.onchanged((e) => {
            // console.log(e.data);
        });
        this.onkeydown((e) => {
            if (Key.Enter === e.keyCode) {
                this.setData({
                    name: 'ces'
                });
            }
        });
    }
    renderView() {
        let html = `<div id="con-lf" class="container">`;
        for (let i = 0; i < 10; i++) {
            html += `<div data-changed=${STB.props({ name: this.state.name })} data-keydown=${STB.props({ name: i })}>${this.state.name}</div>`;
        }
        html += `</div>`;
        return html;
    }
    renderFocus() {
        return new HElement('#con-lf').children();
    }
}

STBDom.render(<any>ListModule, { age: 20 }, document.getElementById("bdy"));

// Focus 组建
// 以模块ID作为标识，实现单例模式

// Module
// 以模块ID作为标识，实现单例模式。重新实例仅渲染 Focus.init

// STBDom 
// 挂载对象到 DOM 