import Axios from "axios";

class WeiXinMessageMainProgram {
  private appID: string = "";
  private appsecret: string = "";

  private ACCESSTOKENCACHE: WeiXinAccessTokenAPI = {};
  private USERLISTCACHE: WeiXinUserListAPI = {};

  private WeiXinGetAccessTokenUrl: string =
    "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=#APPID#&secret=#APPSECRET#";
  private WeiXinGetUserListUrl: string =
    "https://api.weixin.qq.com/cgi-bin/user/get?access_token=#ACCESS_TOKEN#&next_openid=#NEXT_OPENID#";
  private WeiXinSendTemplateMessageUrl: string =
    "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=#ACCESS_TOKEN#";

  constructor(prams: WeiXinMessageMainProgramPrams) {
    const { appID, appsecret } = prams;

    this.appID = appID;
    this.appsecret = appsecret;
  }

  public async init() {
    const AccessToken = await this.getAccessToken({
      appID: this.appID,
      appsecret: this.appsecret,
    });

    return AccessToken;
  }

  public async sendTemplateMessage(
    prams: WeiXinMessageSendTemplateMessage
  ): Promise<WeiXinSendTemplateMessageAPI> {
    let { ACCESS_TOKEN, touser, template_id, url, topcolor, data } = prams;

    if (!ACCESS_TOKEN && this.ACCESSTOKENCACHE.access_token) {
      ACCESS_TOKEN = this.ACCESSTOKENCACHE.access_token;
    } else {
      throw new Error("ACCESS_TOKEN is empty");
    }

    const RequestUrl = this.WeiXinSendTemplateMessageUrl.replace(
      "#ACCESS_TOKEN#",
      ACCESS_TOKEN!
    );

    const payload = {
      touser,
      template_id,
      url,
      topcolor,
      data,
    };

    let response: WeiXinSendTemplateMessageAPI = {};

    await Axios({
      url: RequestUrl,
      method: "POST",
      data: JSON.stringify(payload),
    })
      .then(({ data }) => {
        const respData: WeiXinSendTemplateMessageAPI = data;

        response = respData;
        response.request_time = new Date();

        if (respData.errcode === 0 || respData.errcode === undefined) {
          response.success = true;
        } else {
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
  }

  public async getUserList(
    prams: WeiXinMessageGetUserList
  ): Promise<WeiXinSendTemplateMessageAPI> {
    const { ACCESS_TOKEN, NEXT_OPENID, force } = prams;

    // 判断用户列表缓存
    if (
      force !== true &&
      Object.getOwnPropertyNames(this.USERLISTCACHE).length
    ) {
      return this.USERLISTCACHE;
    }
    const RequestUrl = this.WeiXinGetUserListUrl.replace(
      "#ACCESS_TOKEN#",
      ACCESS_TOKEN
    ).replace("#NEXT_OPENID#", NEXT_OPENID);

    await Axios({
      url: RequestUrl,
      method: "GET",
    })
      .then((data) => {
        const response: WeiXinUserListAPI = data.data;

        this.USERLISTCACHE = response;
        this.USERLISTCACHE.request_time = new Date();

        if (response.errcode === 0 || response.errcode === undefined) {
          this.USERLISTCACHE.success = true;
        } else {
          this.USERLISTCACHE.success = false;
        }
      })
      .catch((err) => {
        this.USERLISTCACHE.request_time = new Date();
        this.USERLISTCACHE.success = false;
        throw err;
      });

    return this.USERLISTCACHE;
  }

  public async getAccessToken(
    prams: WeiXinMessageGetAccessToken
  ): Promise<WeiXinAccessTokenAPI> {
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
    const RequestUrl = this.WeiXinGetAccessTokenUrl.replace(
      "#APPID#",
      appID
    ).replace("#APPSECRET#", appsecret);

    await Axios({
      url: RequestUrl,
      method: "GET",
    })
      .then((data) => {
        const access_token: WeiXinAccessTokenAPI = data.data;

        this.ACCESSTOKENCACHE = access_token;
        this.ACCESSTOKENCACHE.request_time = new Date();
        // 判断请求是否出错
        if (access_token.errcode === 0 || access_token.errcode === undefined) {
          this.ACCESSTOKENCACHE.success = true;
        } else {
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
  }
}

export default WeiXinMessageMainProgram;
