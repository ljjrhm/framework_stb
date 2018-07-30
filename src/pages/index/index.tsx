
import {  area } from "../../framework/component/stb";
import { PageEvent } from "../../framework/component/pageEvent";
import ReactDOM from "../../framework/component/react-dom";
import { React } from "../../framework/component/react";
import { Key } from "../../framework/basic/key";
import { Site } from "../../framework/component/focus";
import "./index.less";
import { PageRegister, BasePage } from "../../framework/component/page";
import { Cookie } from "../../framework/basic/cookie";
import { ParseUrl } from "../../framework/basic/parseUrl";

interface IRequest {
}
interface IParams {
}
interface IMemo {
}
enum MType {
    Nav
}

function FocusItem(data){
    return (
        <div data-keydown={React.props(data)} tag="focus">{data.index}</div>
    );
}

class Counter extends React.Component {
    constructor(props) {
        super(props, MType.Nav, event);
        this.state = {
            num: 0
        }
    }

    render() {
        return (
            <div class="container">
            <FocusItem index="新页面" />
            <FocusItem index="上一个页面" />
            <FocusItem index="2" />
            <FocusItem index="3" />
            <FocusItem index="4" />

            <div onClick={this.onClick}>
                <h1>number: {this.state.num}</h1>
                <button>add</button>
            </div>
            </div>
        );
    }

    onClick=()=>{
        this.setState({ num: this.state.num + 1 });
    }

    subscribeToEvents() {
        
        this.onkeydown((e) => {

            if(Key.Enter === e.keyCode){
                console.log(e.data);
            }
            
            // 是否有效
            let site = area(this.tags, this.index, e.keyCode);

            if (site) {
                this.setFocus(site.index);
            }

        });
    }

    componentFocusUpdate() {
        if (!this.tags || 0 >= this.tags.length) {
            return;
        }

        // 获取节点信息，配置信息
        this.tags.removeClass("focus").eq(this.index).addClass("focus");
    }
}

// 测试
// 子父渲染
// 异步 setState 完成
// 事件代理可处理组件之间异步通信，但是容易导致混乱

// 焦点
// 为标记元素绑定 onfocus 与 onblur 事件
// onfocus 获取焦点事件 onbulr 失去焦点事件
// className 的话每次 setState 类名会更新，并导致其他组件全部更新情况
// 子组件更新完毕事件 父组件更新完毕事件
// 完善 ComponentEvent

let event: PageEvent;

class Page extends BasePage{
    init(){
        event = this.event;
    }
    load(){
        ReactDOM.render(
            <Counter />,
            document.getElementById('root')
        )

        this.event.target(MType.Nav);
    }
}

PageRegister(Page,{
    handler:[
        MType.Nav
    ],
    request:new ParseUrl(location.search).getDecodeURIComponent(),
    cokSource:new Cookie('index_source'),
    cokStatus:new Cookie('index_status')
});