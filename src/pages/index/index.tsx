import { PageType } from "../../framework/component/pageEvent";
import { ReactDOM } from "../../framework/component/react-dom";
import { React } from "../../framework/component/react";
import { Key } from "../../framework/basic/key";
import { PageRegister, BasePage } from "../../framework/component/page";
import { Cookie } from "../../framework/basic/cookie";
import { ParseUrl } from "../../framework/basic/parseUrl";
import "./index.less";
import { Focus } from "../../framework/component/focus";

interface IRequest {
}
interface IParams {
}
interface IMemo {
}
enum MType {
    Nav,
    Content
}

function FocusItem(data) {
    return (
        <div data-keydown={React.props(data)} tag="focus">
        <div>
            <h1>{data.index}</h1>
        </div>
        </div>
    );
}

class NavModule extends React.Component {
    constructor(props) {
        super(props, props.identCode, props.event);
        this.state = {
            num: 0
        }
    }
    componentWillMount() {
        console.log("组件挂载之前")
    }
    componentWillUpdate() {
        console.log("组件更新之前")
    }
    componentDidUpdate() {
        console.log("组件更新之后")
    }
    componentDidMount() {
        console.log("组件挂载完毕");
    }
    render() {
        return (
            <div class="container">
                <FocusItem index="新页面" />
                <FocusItem index="上一个页面" />
                <FocusItem index="2" />
                <FocusItem index="3" />
                <FocusItem index="4" />

                <ContentModule identCode={MType.Content} event={this.event} />

                <div>
                    <h1>
                        {this.state.num}
                    </h1>
                    <button onclick={() => this.onClick()}>点击</button>
                </div>
            </div>
        );
    }
    onClick() {
        this.setState({
            num: this.state.num + 1
        })
    }
    subscribeToEvents() {
        this.onkeydown((e) => {
if(Key.Enter === e.keyCode){
    this.onClick();
}
            // 是否有效
            let site = Focus.area(this.tags, this.index, e.keyCode), success = true;

            if (site) {
                this.setFocus(site.index);
            } else {
                success = false;
            }

            if (!success) {
                if (Key.Up === e.keyCode) {
                    this.event.target(MType.Nav);
                }
            }

        });
    }

    componentFocusUpdate({ from }) {
        if (!this.tags || 0 >= this.tags.length) {
            return;
        }

        // 获取节点信息，配置信息
        this.tags.removeClass("focus");

        if (PageType.Changed === from || PageType.Focus === from) {
            this.tags.eq(this.index).addClass("focus");
        }
    }
}
class ContentModule extends React.Component {
    constructor(props) {
        super(props, props.identCode, props.event);
        this.state = {
            num: 0
        }
    }

    render() {
        return (
            <div>
                这里是内容
            </div>
        );
    }
}

class Page extends BasePage {
    init() {
        console.log("init")
    }
    load() {
        ReactDOM.render(
            <NavModule identCode={MType.Nav} event={this.event} />,
            document.getElementById('root1')
        )

        this.event.target(MType.Nav);
    }
}

PageRegister(Page, {
    handler: [
        MType.Nav,
        MType.Content
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    cokSource: new Cookie('index_source'),
    cokStatus: new Cookie('index_status')
});