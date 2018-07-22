import { BaseLogic, RequestInfo, ResponseInfo } from "./baseLogic";

interface IMain {

}

class CommonLogic extends BaseLogic {
    getMainData(data: IMain, callback: (info: ResponseInfo</** 定义返回类型 **/any>) => void) {
        let request = new RequestInfo(`定义请求地址`, data, function (res) {

            res.status = 200;
            res.message = "";
            res.success = 200 == res.status ? true : false;

            if (res.success) {
                const data = res._response;
                if (data) {
                    res.data = createModel(data);
                }
            } else {
                // ...
            }
            callback(res);
        });

        var createModel = function (data: any) {
            return data;
        }

        this.requestGet(request);
    }
}
export { CommonLogic }