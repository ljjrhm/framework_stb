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
    Component
}

function FocusItem(data) {
    return (
        <div tag="focus"></div>
    );
}

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg:"1.初始化信息;",
            num:0
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
                   <FocusItem />
                   <FocusItem />
                   <FocusItem />
                   <FocusItem />
                </div>
                <p>
                    {this.state.num}
                    {this.state.msg}
                </p>
            </div>
        );
    }
    subscribeToEvents(){
        this.onkeydown((e)=>{
            let s = Focus.scope(this.tags,this.index,e.keyCode);

            if(s){
                this.setFocus(s.index);
            }

            if(e.keyCode === Key.Enter){
                this.enterPush();
            }
        })
    }
    componentDidMount() {

        this.state.msg += '3.程序挂载完毕;程序生命周期检测通过';

        this.setState({
            msg:this.state.msg
        });
    }
    componentFocusUpdate() {
        this.tags.removeClass("focus");
        this.tags.eq(this.index).addClass("focus");
    }
    enterPush(){
        this.setState({
            num:this.state.num+1
        })
    }
}

class Page extends BasePage {
    init() {
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
}

PageRegister(Page, {
    handler: [
        MType.Component
    ],
    request: new ParseUrl(location.search).getDecodeURIComponent(),
    cokSource: new Cookie('index_source'),
    cokStatus: new Cookie('index_status')
});