import { PageSource } from "./pageSource";
import { Cookie } from "../basic/cookie";
import { PageEvent, PageType } from "./pageEvent";

export class BasePage<IRequest = any> {
    protected readonly source: PageSource;
    protected readonly cokStatus: Cookie;
    protected readonly request: IRequest;
    protected readonly event: PageEvent;

    constructor(params:{
        request,
        event,
        cokStatus,
        source
    }){
    const {request,cokStatus,source,event} = params;
        this.source = source;
        this.cokStatus = cokStatus;
        this.request = request;
        this.event = event;
    }

    init() { };
    subscribeToEvents() { };
    load() { };
    openBlank(){
        console.log("not found blank logic");
    };
    openPrevious(){
        console.log("not found previous logic");
    };
}

export function PageRegister(page: any,params:{
    handler:number[];
    request:object;
    cokSource:Cookie;
    cokStatus:Cookie;
    debugSystem?:boolean;
    debugOther?:boolean;
}) {

    let event = new PageEvent(null, [
        {
            topic: PageType.Keydown, data: null, handler: params.handler
        }
    ], (params.debugOther && params.debugOther) || false, (params.debugSystem && params.debugSystem) || false);

    let p = new page({
        ...params,
        event:event
    });
    p.init();
    p.subscribeToEvents();
    p.load();

    event.on(params.handler,PageType.Blank,()=>{
        p.openBlank();
    });
    event.on(params.handler,PageType.Previous,()=>{
        p.openPrevious();
    })
}
