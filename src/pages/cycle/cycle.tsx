import { PageType } from "../../framework/component/pageEvent";
import { ReactDOM } from "../../framework/component/react-dom";
import { React } from "../../framework/component/react";
import { Key } from "../../framework/basic/key";
import { PageRegister, BasePage } from "../../framework/component/page";
import { Cookie } from "../../framework/basic/cookie";
import { ParseUrl } from "../../framework/basic/parseUrl";
import "./cycle.less";
import { Focus } from "../../framework/component/focus";
import { PageSource } from "../../framework/component/pageSource";

interface IRequest {
}
interface IParams {
}
interface IMemo {
}
enum MType {
    Component
}

function FocusItem(data) {
    return (
        <div tag="focus">{data.text}</div>
    );
}

class Container extends React.Component<{},{msg,num}> {
    constructor(props) {
        super(props);
        this.state = {
            msg: "1.初始化信息;",
            num: 0
        }
    }
    componentWillMount() {
        this.state.msg += '2.程序挂载之前;'
    }
    render() {
        return (
            <div>
                <h1>组件渲染以及焦点引擎检测</h1>
                <div>
                    <FocusItem text="点击+1" />
                    <FocusItem text="点击-1" />
                    <FocusItem />
                    <FocusItem />
                    <span class="number">
                        {this.state.num}
                    </span>
                </div>
                <p>
                    {this.state.msg}
                </p>
            </div>
        );
    }
    subscribeToEvents() {
        this.onkeydown((e) => {
            let s = Focus.scope(this.tags, this.index, e.keyCode);

            if (s) {
                this.setFocus(s.index);
            }

            if (e.keyCode === Key.Enter) {
                if (0 === this.index) {
                    this.setState({
                        num: this.state.num + 1
                    })
                }
                else if (1 === this.index) {
                    this.setState({
                        num: this.state.num - 1
                    })
                }

            }
            if (Key.Backspace === e.keyCode) {
                this.trigger(PageType.Previous);
            }
        })
    }
    componentDidMount() {

        this.state.msg += '3.程序挂载完毕;程序生命周期检测通过';

        this.setState({
            msg: this.state.msg
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

        document.getElementById('page-cycle').innerHTML += '1.初始化完毕 </br>';
    }
    load() {
        ReactDOM.render(
            <Container identCode={MType.Component} event={this.event} />,
            document.getElementById('page')
        )

        this.event.target(MType.Component);

        document.getElementById('page-cycle').innerHTML += '3.加载完毕</br> 页面生命周期检测通过';
    }
    subscribeToEvents() {
        document.getElementById('page-cycle').innerHTML += '2.事件加载完毕 </br>';
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
        MType.Component
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    source: new PageSource('cycle_source'),
    cokStatus: new Cookie('cycle_status')
});