import { BasePage, PageRegister } from "../../framework/component/page";
import { ReactDOM } from "../../framework/component/react-dom";
import { React } from "../../framework/component/react";
import { Cookie } from "../../framework/basic/cookie";
import { ParseUrl } from "../../framework/basic/parseUrl";
import { Focus } from "../../framework/component/focus";
import { Key } from "../../framework/basic/key";

import "./index.less";
import { PageType } from "../../framework/component/pageEvent";
import { PageSource } from "../../framework/component/pageSource";

/**
 * 盒子测试索引页面
 */

enum MType {
    List
}

class ListModule extends React.Component<{name},{}> {
    render() {
        return (
            <div class="panel-default">
                <div class="panel-heading">盒子环境检测</div>
                <div class="panel-body">
                    <div class="list-group" id="list-group">
                        <div tag="focus" class="list-group-item" data-keydown={React.props({href:"./html_test.html"})}>HTML</div>
                        <div tag="focus" class="list-group-item" data-keydown={React.props({href:"./css_test.html"})}>CSS</div>
                        <div tag="focus" class="list-group-item" data-keydown={React.props({href:"./plugin_test.html"})}>插件</div>
                        <div tag="focus" class="list-group-item" data-keydown={React.props({href:"./cycle.html"})}>页面及组件生命周期</div>
                    </div>
                </div>
            </div>
        );
    }
    subscribeToEvents() {
        this.onkeydown((e) => {
            let s = Focus.scope(this.tags, this.index, e.keyCode);

            if (s) {
                this.setFocus(s.index);
            }

            if(Key.Enter === e.keyCode){
                this.trigger(PageType.Blank,{url:e.data.href});
            }

            if(Key.Backspace === e.keyCode){
                this.trigger(PageType.Previous);
            }
        });
        
    }
    componentFocusUpdate() {
        this.tags.removeClass("focus");
        this.tags.eq(this.index).addClass("focus");
    }
}

class Page extends BasePage {
    init() {
        this.source.saveToLocal(document.referrer);
    }
    load() {
        ReactDOM.render(
            <ListModule identCode={MType.List} event={this.event} />,
            document.getElementById('page')
        )

        this.event.target(MType.List);

    }
    subscribeToEvents() {

    }
    openBlank(data){
        window.location.href = data.url;
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
    source: new PageSource('index_source'),
    cokStatus: new Cookie('index_status')
});