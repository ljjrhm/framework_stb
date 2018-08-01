import { enqueueSetState } from './set-state-queue'
import { PageEvent, PageType } from '../pageEvent';
import { HElement } from '../../basic/helement';
import { Json } from '../../basic/json';

/**
 * @description event 定义父组件尽可能不操作 event 对象
 */
export class Component {
    private isReactComponent: boolean;
    protected state: any;
    protected readonly props: any;
    protected readonly identCode;
    protected readonly tags: HElement;
    protected readonly index = 0;
    protected readonly event: PageEvent;

    constructor(props = {}, identCode?, event?: PageEvent) {

        this.isReactComponent = true;

        this.state = {};
        this.props = props;
        this.identCode = identCode;
        this.event = event;

        let hasSub = false, hasOff = false;

        // identCode event 检测
        if (undefined !== identCode && undefined !== event && event) {

            // 确保模块事件不会重复订阅
            if (this.event.hasSubscribe(this.identCode, PageType.Focus)) {
                // 更新订阅
                hasOff = true;
            }
            hasSub = true;

        }

        if (hasOff) {
            offAll(this.event, this.identCode);
        }
        if (hasSub) {
            event.on(identCode, PageType.Focus, (e: FocusEvent) => {
                this.componentFocusUpdate({ from: PageType.Focus });
            });
            event.on(identCode, PageType.Blur, (e: FocusEvent) => {
                this.componentFocusUpdate({ from: PageType.Blur });
            });
        }
    }

    setState(stateChange) {
        enqueueSetState(stateChange, this);
    }
    setFocus(index) {
        (<any>this).index = index;
        this.componentFocusUpdate({ from: PageType.Changed });
    }

    componentWillUpdate() { };
    componentDidUpdate(prevProps, prevState) { };
    componentWillMount() { };
    componentDidMount() { };
    componentFocusUpdate(from) { };
    render() { };
    subscribeToEvents() { };

    // 自定义事件
    onfocus(callback: (e: IFocus) => void) {
        this.event.on(this.identCode, PageType.Focus, callback);
    }
    onblur(callback: (e: IBlur) => void) {
        this.event.on(this.identCode, PageType.Blur, callback);
    }
    onkeydown(callback: (e: IKeydown) => void) {
        this.event.on(this.identCode, PageType.Keydown, (e: IKeydown) => {
            let ele = this.tags.eq(this.index);
            if (ele) {
                let data = ele.attr('data-keydown');

                if (data) {
                    e.data = Json.deSerializ(data);
                }
            }
            callback(e);
        });
    }
    target(identCode: string | number, data?: any) {
        this.event.target(identCode, data);
    }
}
function offAll(event: PageEvent, identCode) {
    event.off(identCode, PageType.Focus);
    event.off(identCode, PageType.Blur);
    event.off(identCode, PageType.Keydown);
}