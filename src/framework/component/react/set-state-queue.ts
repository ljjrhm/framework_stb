import { renderComponent } from "../react-dom/diff";
import { Extend } from "../../basic/extend";
import { HElement } from "../../basic/helement";

const setStateQueue = [];
const renderQueue = [];

function defer(fn) {
    return Promise.resolve().then(fn);
}

export function enqueueSetState(stateChange, component) {

    if (setStateQueue.length === 0) {
        defer(flush);
    }
    setStateQueue.push({
        stateChange,
        component
    });

    if (!renderQueue.some(item => item === component)) {
        renderQueue.push(component);
    }
}

function flush() {
    let item, component;
    while (item = setStateQueue.shift()) {

        const { stateChange, component } = item;

        // 如果没有prevState，则将当前的state作为初始的prevState
        if (!component.prevState) {

            // component.prevState = Object.assign( {}, component.state );
            component.prevState = Extend(false, {}, component.state);
        }

        // 如果stateChange是一个方法，也就是setState的第二种形式
        if (typeof stateChange === 'function') {

            // Object.assign( component.state, stateChange( component.prevState, component.props ) );
            Extend(false, component.state, stateChange(component.prevState, component.props));

        } else {
            // 如果stateChange是一个对象，则直接合并到setState中
            // Object.assign( component.state, stateChange );
            Extend(false, component.state, stateChange);

        }

        component.prevState = component.state;

    }

    while (component = renderQueue.shift()) {

        renderComponent(component);

        console.log('更新完毕');
        // // 处理焦点
        // // 获取当前焦点节点
        let eles = new HElement(component.base).find('[tag=focus]');
        console.log(eles);

        // 当前焦点元素是否存在
        if (eles && eles.length) {

            component.tags = eles;

            // 不存在则重置
            if (component.index < eles.length) {

                // 如果存在，判断当前是否有效，无效设置第一个



            } else {
                component.index = 0;
            }


        } else {
            component.index = undefined;
        }

        // // 更新到当前节点
        component.componentDidUpdate(component.prevState, component.props);

    }
}
