import { BasePage, PageRegister } from "../../framework/component/page";
import { ReactDOM } from "../../framework/component/react-dom";
import { ParseUrl } from "../../framework/basic/parseUrl";
import { Cookie } from "../../framework/basic/cookie";
import { PageSource } from "../../framework/component/pageSource";
import { PageType } from "../../framework/component/pageEvent";
import { Key } from "../../framework/basic/key";

import "./css_test.less";

enum MType{
    List
}

class Page extends BasePage {
    init() {
        this.source.saveToLocal(document.referrer);
    }
    load() {
        this.event.target(MType.List);
    }
    subscribeToEvents() {
        this.event.on(MType.List,PageType.Focus,()=>{

        })
        this.event.on(MType.List,PageType.Keydown,(e)=>{

            if(Key.Backspace === e.keyCode){
                this.event.trigger(MType.List,PageType.Previous);
            }
        })
    }
    openPrevious() {
        let url = this.source.takeToLocal();

        this.source.removeToLocal();
        this.cokStatus.clearCookie();

        window.location.href = url;
    }
}

PageRegister(Page, {
    handler: [
        MType.List
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource('css_test_source'),
    cokStatus: new Cookie('css_test_status')
});