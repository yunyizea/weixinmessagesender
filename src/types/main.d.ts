type WeiXinMessageMainProgramPrams = {
  appID: string;
  appsecret: string;
};

type WeiXinMessageSendTemplateMessage = {
  ACCESS_TOKEN?: string;
  touser: string;
  template_id: string;
  url?: string;
  topcolor?: string;
  data: {
    [key: string]: {
      value: string;
      color?: string;
    };
  };
};

type WeiXinMessageGetUserList = {
  ACCESS_TOKEN: string;
  NEXT_OPENID: string;
  force?: boolean;
};

type WeiXinMessageGetAccessToken = {
  appID: string;
  appsecret: string;
};

type WeiXinSendTemplateMessageAPI = {
  errcode?: number;
  errmsg?: string;
  msgid?: number;

  request_time?: Date;
  success?: boolean;
};

type WeiXinUserListAPI = {
  total?: number;
  count?: number;
  data?: {
    openid?: string[];
  };
  next_openid?: string;

  errcode?: number;
  errmsg?: string;

  request_time?: Date;
  success?: boolean;
};

type WeiXinAccessTokenAPI = {
  access_token?: string;
  expires_in?: number;

  errcode?: number;
  errmsg?: string;

  request_time?: Date;
  success?: boolean;
};
