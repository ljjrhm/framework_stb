
import { area } from "../../framework/component/stb";
import { PageEvent, PageType } from "../../framework/component/pageEvent";
import {ReactDOM} from "../../framework/component/react-dom";
import { React } from "../../framework/component/react";
import { Key } from "../../framework/basic/key";
import { PageRegister, BasePage } from "../../framework/component/page";
import { Cookie } from "../../framework/basic/cookie";
import { ParseUrl } from "../../framework/basic/parseUrl";
import "./index.less";

interface IRequest {
}
interface IParams {
}
interface IMemo {
}
enum MType {
    Nav,
    Nav2
}

function FocusItem(data) {
    return (
        <div data-keydown={React.props(data)} tag="focus">{data.index}</div>
    );
}

class Module1 extends React.Component {
    constructor(props) {
        super(props, props.identCode, props.event);
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

    onClick = () => {
        this.setState({ num: this.state.num + 1 });
    }

    subscribeToEvents() {

        this.onkeydown((e) => {

            if (Key.Enter === e.keyCode) {
                this.onClick();
            }

            // 是否有效
            let site = area(this.tags, this.index, e.keyCode), success = true;

            if (site) {
                this.setFocus(site.index);
            } else {
                success = false;
            }

            if (!success) {
                if (Key.Up === e.keyCode) {
                    this.event.target(MType.Nav);
                }
                else if (Key.Down === e.keyCode) {
                    this.event.target(MType.Nav2);
                }
            }

        });
    }

    componentFocusUpdate({from}) {
        if (!this.tags || 0 >= this.tags.length) {
            return;
        }

        // 获取节点信息，配置信息
        this.tags.removeClass("focus");

        if(PageType.Changed === from || PageType.Focus === from){
            this.tags.eq(this.index).addClass("focus");
        }
    }
}

// 测试

// 优化
// className 的话每次 setState 类名会更新，并导致其他组件全部更新情况
// 组件重复订阅时，卸载掉之前注册的事件

class Page extends BasePage {
    init() {
        console.log("init")
    }
    load() {
        ReactDOM.render(
            <Module1 identCode={MType.Nav} event={this.event} />,
            document.getElementById('root1')
        )

        ReactDOM.render(
            <Module1 identCode={MType.Nav2} event={this.event} />,
            document.getElementById('root2')
        )

        this.event.target(MType.Nav);

        console.log("load3")
    }
}

PageRegister(Page, {
    handler: [
        MType.Nav,
        MType.Nav2
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    cokSource: new Cookie('index_source'),
    cokStatus: new Cookie('index_status')
});