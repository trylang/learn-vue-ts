import Axios from 'axios';
import { Message } from 'element-ui';
// import { getToken } from '@/views/utils/auth';

const devUrl = 'https://wx-mini.rtmap.com/';
const proUrl = 'http://appsmall.rtmap.com/';
const jiantingUrl = 'http://10.10.10.230:8704/';
const APIUrl = '/api';

let userRouter = JSON.parse(sessionStorage.getItem("userRouter") || null) || {};

export const api = proUrl;

const httpServer = (opts: any) => {
  const httpDefaultOpts = {
    // http默认配置
    method: opts.method,
    baseURL: api, // 测试
    url: opts.url,
    timeout: 100000,
    params: opts.params,
    data: opts.params,
    responseType: opts.responseType,
    headers:
      opts.method === 'get'
        ? {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
            token: userRouter.token
          }
        : {
            'Content-Type': 'application/json;charset=UTF-8',
            token: userRouter.token
          },
  };
  // if (getToken()) {
  //   const token: any = getToken();
  //   httpDefaultOpts.headers.systoken = token;
  // }
  if (opts.method === 'get') {
    delete httpDefaultOpts.data;
  } else {
    delete httpDefaultOpts.params;
  }
  const promise = new Promise((resolve, reject) => {
    Axios(httpDefaultOpts)
      .then((res) => {
        if (!res.data.status) {
          if (res.headers['content-type'] === 'application/json;charset=utf-8') {
            Message({
              showClose: true,
              message: '导出内容没有数据',
              type: 'error',
            });
            // reject(res);
          } else {
            resolve(res.data);
          }  
        } else if (res.data.status === 200) {
          resolve(res.data);
        } else {
          Message({
            showClose: true,
            message: res.data.message,
            type: 'error',
          });
        }
      })
      .catch((response) => {
        Message({
          showClose: true,
          message: response.response.data.message,
          type: 'error',
        });
        reject(response);
      });
  });
  return promise;
};

export default httpServer;
