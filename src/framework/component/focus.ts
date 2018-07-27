import { HElement } from "../basic/helement";
import { Key } from "../basic/key";
import { Position } from "../basic/position";

/**
 * @name 焦点引擎
 */

class Site {
    public index: number = null;
    public element: IHElement = null;
}

class Focus {
    private eles: IHElement;
    private site: Site = null;
    private list: Array<Site> = [];

    constructor() {
    }
    initData(ele: IHElement) {
        this.eles = ele;
        this.list.length = 0;

        let eles = this.eles.getAll();

        eles.forEach((v, i) => {
            this.list.push({
                index: i,
                element: new HElement(v)
            });
        });
    }
    setSite(index: number): void {
        if (this.list.length > index) {
            this.site = this.list[index];
        }
    }
    getSite(index?: number): Site {
        if (undefined === index) {
            return this.site;
        }
        else {
            return this.list[index];
        }
    }
    getNear(keyCode: Key.Up | Key.Down | Key.Right | Key.Left): Site {
        if (!this.site) {
            return;
        }

        let eles = this.list, posis: { num: number, left: number, top: number, right: number, bottom: number, site: Site }[] = [], curPos = Position(this.site.element.get(0));

        // 确定方向
        if (Key.Up === keyCode) {

            // 找到范围有效
            eles.forEach((v, i) => {
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

            eles.forEach((v, i) => {
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
            eles.forEach((v, i) => {

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
            eles.forEach((v, i) => {
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
    getSites(): Array<Site> {
        return this.list;
    }
    getHelement(): IHElement {
        return this.eles;
    }
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
export { Site, Focus }