import { BasePage, PageRegister } from "../../framework/component/page";
import { ReactDOM } from "../../framework/component/react-dom";
import { React } from "../../framework/component/react";
import { Cookie } from "../../framework/basic/cookie";
import { ParseUrl } from "../../framework/basic/parseUrl";
import { Focus } from "../../framework/component/focus";
import { Key } from "../../framework/basic/key";

import .less";
import { PageType } from "../../framework/component/pageEvent";
import { PageSource } from "../../framework/component/pageSource";


class Page extends BasePage {
    init() {
        
    }
    load() {

    }
}

PageRegister(Page, {
    handler: [
        MType.List
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource(_source'),
    cokStatus: new Cookie(_status')
});