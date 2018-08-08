import { BasePage, PageRegister } from "../../framework/component/page";
import { ReactDOM } from "../../framework/component/react-dom";
import { ParseUrl } from "../../framework/basic/parseUrl";
import { Cookie } from "../../framework/basic/cookie";
import { PageSource } from "../../framework/component/pageSource";
import { PageType } from "../../framework/component/pageEvent";
import { Key } from "../../framework/basic/key";

import "./plugin_test.less";
import { HElement } from "../../framework/basic/helement";
import { HorizontalRoll } from "../../framework/component/horizontalRoll";

enum MType{
    List
}

class Page extends BasePage {
    init() {
        this.source.saveToLocal(document.referrer);


        new Promise((resolve, reject) => {
            resolve();
        }).then(() => {
            setTimeout(() => {
                new HElement("#msg").text("默认消息")
            }, 1000)
        })
    
        Promise.all([
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 2000)
            }).then(() => {
                new HElement("#msg").text("等待了两秒")
            }),
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 4000)
            }).then(() => {
                new HElement("#msg").text("等待了四秒")
            })
        ]).then(() => {
            setTimeout(() => {
                new HElement("#msg").text("检测通过")
            }, 2000)
        });

        new HorizontalRoll(new HElement(".horizontal")).enable();
    
        let ele = new HElement(".velocity").get(0);
    
        Velocity(ele, "stop");
        Velocity(ele, {
            marginLeft: '1000px'
        }, {
                duration: 2000
            });
            
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
    source: new PageSource('plugin_test_source'),
    cokStatus: new Cookie('plugin_test_status')
});