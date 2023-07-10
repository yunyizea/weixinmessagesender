var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Axios from "axios";
export default class WeiXinMessageMainProgram {
    constructor(prams) {
        this.appID = "";
        this.appsecret = "";
        this.ACCESSTOKENCACHE = {};
        this.USERLISTCACHE = {};
        this.WeiXinGetAccessTokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=#APPID#&secret=#APPSECRET#";
        this.WeiXinGetUserListUrl = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=#ACCESS_TOKEN#&next_openid=#NEXT_OPENID#";
        this.WeiXinSendTemplateMessageUrl = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=#ACCESS_TOKEN#";
        const { appID, appsecret } = prams;
        this.appID = appID;
        this.appsecret = appsecret;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const AccessToken = yield this.getAccessToken({
                appID: this.appID,
                appsecret: this.appsecret,
            });
            return AccessToken;
        });
    }
    sendTemplateMessage(prams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ACCESS_TOKEN, touser, template_id, url, topcolor, data } = prams;
            const RequestUrl = this.WeiXinSendTemplateMessageUrl.replace("#ACCESS_TOKEN#", ACCESS_TOKEN);
            const payload = {
                touser,
                template_id,
                url,
                topcolor,
                data,
            };
            let response = {};
            yield Axios({
                url: RequestUrl,
                method: "POST",
                data: JSON.stringify(payload),
            })
                .then(({ data }) => {
                const respData = data;
                response = respData;
                response.request_time = new Date();
                if (respData.errcode === 0 || respData.errcode === undefined) {
                    response.success = true;
                }
                else {
                    response.success = false;
                }
            })
                .catch((err) => {
                response = {};
                response.request_time = new Date();
                response.success = false;
                throw err;
            });
            return response;
        });
    }
    getUserList(prams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ACCESS_TOKEN, NEXT_OPENID, force } = prams;
            // 判断用户列表缓存
            if (force !== true &&
                Object.getOwnPropertyNames(this.USERLISTCACHE).length) {
                return this.USERLISTCACHE;
            }
            const RequestUrl = this.WeiXinGetUserListUrl.replace("#ACCESS_TOKEN#", ACCESS_TOKEN).replace("#NEXT_OPENID#", NEXT_OPENID);
            yield Axios({
                url: RequestUrl,
                method: "GET",
            })
                .then((data) => {
                const response = data.data;
                this.USERLISTCACHE = response;
                this.USERLISTCACHE.request_time = new Date();
                if (response.errcode === 0 || response.errcode === undefined) {
                    this.USERLISTCACHE.success = true;
                }
                else {
                    this.USERLISTCACHE.success = false;
                }
            })
                .catch((err) => {
                this.USERLISTCACHE.request_time = new Date();
                this.USERLISTCACHE.success = false;
                throw err;
            });
            return this.USERLISTCACHE;
        });
    }
    getAccessToken(prams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { appID, appsecret } = prams;
            // 判断程序运行时，是否存在 AccessToken 的缓存，如果存在，则不再新获取
            if (Object.getOwnPropertyNames(this.ACCESSTOKENCACHE).length) {
                if (this.ACCESSTOKENCACHE.success && this.ACCESSTOKENCACHE.request_time) {
                    // 微信官方文档给出的过期时间为 2 小时，即 7200 000 ms
                    const expire = this.ACCESSTOKENCACHE.request_time.getTime() + 7200000;
                    if (expire > new Date().getTime()) {
                        return this.ACCESSTOKENCACHE;
                    }
                }
            }
            // 构造请求URL
            const RequestUrl = this.WeiXinGetAccessTokenUrl.replace("#APPID#", appID).replace("#APPSECRET#", appsecret);
            yield Axios({
                url: RequestUrl,
                method: "GET",
            })
                .then((data) => {
                const access_token = data.data;
                this.ACCESSTOKENCACHE = access_token;
                this.ACCESSTOKENCACHE.request_time = new Date();
                // 判断请求是否出错
                if (access_token.errcode === 0 || access_token.errcode === undefined) {
                    this.ACCESSTOKENCACHE.success = true;
                }
                else {
                    // 错误则赋空并设置失败
                    this.ACCESSTOKENCACHE.success = false;
                }
            })
                .catch((err) => {
                // 网络等大错误也同样赋空
                this.ACCESSTOKENCACHE = {};
                this.ACCESSTOKENCACHE.request_time = new Date();
                this.ACCESSTOKENCACHE.success = false;
                throw err;
            });
            return this.ACCESSTOKENCACHE;
        });
    }
}
