import { Key } from "../basic/key";
import { HElement } from "../basic/helement";
import {Position} from "../basic/position";

class Site{
    index:number;
    element:IHElement;
}

/**
 * 临界线以外查找区域
 */
function area(ele: IHElement, index: number, keyCode: Key.Up | Key.Down | Key.Right | Key.Left): Site {

    let eles: HTMLElement[] = ele.getAll(), list: { index: number, element: HElement }[] = [];

    eles.forEach((v, i) => {
        list.push({
            index: i,
            element: new HElement(v)
        });
    });

    let posis: { num: number, left: number, top: number, right: number, bottom: number, site: Site }[] = [], curPos = Position(ele.eq(index).get(0));

    // 确定方向
    if (Key.Up === keyCode) {

        // 找到范围有效
        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效顶部
            if (item.bottom <= curPos.top) {
                // 阴影检测
                if (shadown(curPos, item, Key.Up)) {
                    let x1 = curPos.left;
                    let x2 = item.left;
                    let y1 = curPos.top;
                    let y2 = item.bottom;

                    let num = distance(x1, x2, y1, y2);

                    posis.push({ ...item, site: v, num: num });
                }

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });

    }
    else if (Key.Right === keyCode) {

        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效右边
            if (item.left >= curPos.right) {
                // 阴影检测
                if (shadown(curPos, item, Key.Right)) {
                    let x1 = curPos.left;
                    let x2 = item.left;
                    let y1 = curPos.top;
                    let y2 = item.bottom;

                    let num = distance(x1, x2, y1, y2);

                    posis.push({ ...item, site: v, num: num });
                }
            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });

    }
    else if (Key.Down === keyCode) {
        // 找到范围有效
        list.forEach((v, i) => {

            let item = Position(v.element.get(0));
            // 有效底部
            if (item.top >= curPos.bottom) {
                // 阴影检测
                if (shadown(curPos, item, Key.Down)) {
                    let x1 = curPos.left;
                    let x2 = item.left;
                    let y1 = curPos.top;
                    let y2 = item.top;

                    let num = distance(x1, x2, y1, y2);

                    posis.push({ ...item, site: v, num: num });
                }

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });
    }
    else if (Key.Left === keyCode) {
        // 找到范围有效
        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效左边
            if (item.right <= curPos.left) {

                // 阴影检测
                if (shadown(curPos, item, Key.Left)) {

                    let x1 = curPos.left;
                    let x2 = item.left;
                    let y1 = curPos.top;
                    let y2 = item.bottom;

                    let num = distance(x1, x2, y1, y2);

                    posis.push({ ...item, site: v, num: num });
                }

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });
    }
    return posis.length ? posis[0].site : null;
}
/**
 * 阴影内查找范围
 */
function scope(ele: IHElement, index: number, keyCode: Key.Up | Key.Down | Key.Right | Key.Left): Site {

    let eles: HTMLElement[] = ele.getAll(), list: { index: number, element: HElement }[] = [];

    eles.forEach((v, i) => {
        list.push({
            index: i,
            element: new HElement(v)
        });
    });

    let posis: { num: number, left: number, top: number, right: number, bottom: number, site: Site }[] = [], curPos = Position(ele.eq(index).get(0));

    // 确定方向
    if (Key.Up === keyCode) {

        // 找到范围有效
        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效顶部
            if (item.bottom <= curPos.top) {

                let x1 = curPos.left;
                let x2 = item.left;
                let y1 = curPos.top;
                let y2 = item.bottom;

                let num = distance(x1, x2, y1, y2);

                posis.push({ ...item, site: v, num: num });

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });

    }
    else if (Key.Right === keyCode) {

        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效右边
            if (item.left >= curPos.right) {
                let x1 = curPos.left;
                let x2 = item.left;
                let y1 = curPos.top;
                let y2 = item.bottom;

                let num = distance(x1, x2, y1, y2);

                posis.push({ ...item, site: v, num: num });
            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });

    }
    else if (Key.Down === keyCode) {
        // 找到范围有效
        list.forEach((v, i) => {

            let item = Position(v.element.get(0));
            // 有效底部
            if (item.top >= curPos.bottom) {
                let x1 = curPos.left;
                let x2 = item.left;
                let y1 = curPos.top;
                let y2 = item.top;

                let num = distance(x1, x2, y1, y2);

                posis.push({ ...item, site: v, num: num });

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });
    }
    else if (Key.Left === keyCode) {
        // 找到范围有效
        list.forEach((v, i) => {
            let item = Position(v.element.get(0));
            // 有效左边
            if (item.right <= curPos.left) {

                let x1 = curPos.left;
                let x2 = item.left;
                let y1 = curPos.top;
                let y2 = item.bottom;

                let num = distance(x1, x2, y1, y2);

                posis.push({ ...item, site: v, num: num });

            }
        });

        // 找到需要的节点
        posis.sort((v, z) => {
            return v.num - z.num;
        });
    }
    return posis.length ? posis[0].site : null;
}
function distance(x1: number, x2: number, y1: number, y2: number) {
    let c = (Math.abs((x1 - x2)) * Math.abs((x1 - x2))) + (Math.abs((y1 - y2)) * Math.abs((y1 - y2)));
    return Math.sqrt(c);
}
function shadown(p1: { top: number, left: number, right: number, bottom: number }, p2: { top: number, left: number, right: number, bottom: number }, keyCode: Key.Left | Key.Up | Key.Right | Key.Down): boolean {

    if (keyCode === Key.Right || keyCode === Key.Left) {
        // 1. 顶点有效
        if ((p1.top <= p2.top && p1.bottom >= p2.top)) {
            return true;
        }
        // 2. 底点有效
        else if ((p1.top <= p2.bottom && p1.bottom >= p2.bottom)) {
            return true;
        }
        // 3. 身体部分有效
        else if ((p1.top >= p2.top && p1.bottom <= p2.bottom)) {
            return true;
        }
    }
    else if (keyCode === Key.Up || keyCode === Key.Down) {
        // 1. 顶点有效
        if ((p1.left <= p2.left && p1.right >= p2.left)) {
            return true;
        }
        // 2. 底点有效
        else if ((p1.left <= p2.right && p1.right >= p2.right)) {
            return true;
        }
        // 3. 身体部分有效
        else if ((p1.left >= p2.left && p1.right <= p2.right)) {
            return true;
        }
    }
    return false;
}

var Focus = {
    area:area,
    scope:scope
}
export {Focus};