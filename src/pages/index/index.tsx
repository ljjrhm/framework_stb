import "./index.less";
import { PageEvent } from "../../framework/script/component/pageEvent";
import { CommonLogic } from "../../logics/commonLogic";

let event = new PageEvent("index", null);


let lgc = new CommonLogic();

function component() {
    return (
        <div>
            <h1>标题</h1>
            <p>内容</p>
        </div>
    );
}