import { enqueueSetState } from './set-state-queue'
import { PageEvent, PageType } from '../pageEvent';
import { HElement } from '../../basic/helement';
import { Json } from '../../basic/json';

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

        // 无状态组建不处理
        if(undefined === identCode){
            this.subscribeToEvents = null;
        }
        if (event) {
            // 确保模块事件不会重复订阅
            if (this.event.hasSubscribe(this.identCode, PageType.Focus)) {
                this.subscribeToEvents = null;
            } else {
                event.on(identCode, PageType.Focus, (e: FocusEvent) => {
                    this.componentFocusUpdate({from:PageType.Focus});
                });
                event.on(identCode, PageType.Blur, (e: FocusEvent) => {
                    this.componentFocusUpdate({from:PageType.Blur});
                });
            }
        } else {
            this.subscribeToEvents = null;
        }
    }

    setState(stateChange) {
        enqueueSetState(stateChange, this);
    }
    setFocus(index) {
        (<any>this).index = index;
        this.componentFocusUpdate({from:PageType.Changed});
    }

    componentWillUpdate() { };
    componentDidUpdate(prevProps, prevState) { };
    componentWillMount() { };
    componentDidMount() { };
    componentFocusUpdate(from) { };
    render() { };
    subscribeToEvents() { };

    // 自定义事件
    on(topic: string | number, callback: any) {
        this.event.on(this.identCode, topic, callback);
    }
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
    trigger(topic: string | number, data: any = null) {
        this.event.trigger(this.identCode, topic, data);
    }
}