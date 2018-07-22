/**
 * 编辑作者：
 * 创建时间：
 * 功能分类：
 */
interface IRequest {
}
interface IParams {
}
interface IMemo {
}

enum MType {
    Content
}

Page<IRequest, IParams, IMemo>(
    "index",
    [
        MType.Content
    ], {
        entrancePage(request, memo) {
        },
        initData(request, memo) {
            return new Promise((resolve, reject) => {
                resolve();
            });
        },
        recoverPage(memo) {
        }
    });