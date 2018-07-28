import React from "../../framework/component/react";
import ReactDOM from "../../framework/component/react-dom";

import "./index.less"
import { Page } from "../../framework/component/stb";
import { PageEvent, PageType } from "../../framework/component/pageEvent";


interface IRequest {
}
interface IParams {
}
interface IMemo {
}
enum MType {
    Nav,
    Content,
    Page
}

class Counter extends React.Component {
    constructor(props) {
        super(props, MType.Nav, event);
        this.state = {
            num: 0
        }
    }

    render() {
        this.tags
        console.log("render");
        return (
            <div class="container">
            <div tag='focus'>1</div>
                <div tag='focus'>2</div>
                <div tag='focus'>3</div>
                <h1>count: {this.state.num}</h1>
                <button onclick={() => this.onClick()} >add</button>
            </div>
        );
    }

    onClick() {
        this.setState({ num: this.state.num + 1 });
    }

    subscribeToEvents(e: PageEvent) {

        console.log('订阅事件', e);

        e.on(MType.Nav, PageType.Focus, (e) => {
            console.log(e);
        });

        e.on(MType.Nav, PageType.Changed, (e) => {
            console.log(e);
        });
        
    }

    componentDidMount() {
        for (let i = 0; i < 10; i++) {
            console.log(i)
            this.setState({ num: i })
        }
    }
}


// 测试
// 渲染 完成
// 子父渲染
// 设置属性
// 事件当前上下文 完成
// 异步 setState 完成
// 焦点
// 事件代理可处理组件之间异步通信，但是容易导致混乱

// 焦点
// 为标记元素绑定 onfocus 与 onblur 事件
// onfocus 获取焦点事件 onbulr 失去焦点事件
// className 的话每次 setState 类名会更新，并导致其他组件全部更新情况

let event: PageEvent;

Page<IRequest, IParams, IMemo>("index", [MType.Nav, MType.Content], {
    entrancePage(request, memo) {

        event = this.event;

        ReactDOM.render(
            <Counter />,
            document.getElementById('root')
        );

        this.event.target(MType.Nav);
    }
});