/**
 * 封装axios请求
 */

import axios from 'axios'

function getBaseUrl () {
  let baseUrl = '';
  if (process.env.NODE_ENV === 'development') {
    baseUrl = '/api/';
  } else {
    baseUrl = window.location.origin
  }
  return baseUrl;
}

const service = axios.create({
  baseURL: getBaseUrl(), // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    return config
  }
)

// response interceptor

service.interceptors.response.use(
  response => {
    console.log('response: ', response);
    const res = response.data
    if (response.config.url.includes('file/download')) {
      return response;
    }

    // if the custom code is not 20000, it is judged as an error.
    // 不包含路径是'file/download'的请求，因为这个请求返回的是文件流，不是json数据
    if (res.code !== 0 && !response.config.url.includes('file/download')) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  }
)

const Method = {
  GET: 'get',
  POST: 'post',
  Download: 'download',
};

// 封装一个request方法，用于发送请求
// 该方法返回一个promise对象

async function request (url, method = Method.GET, data) {
  // 根据method的值，来决定使用axios的哪个方法和传递的参数
  if (method === Method.GET) {
    return service.get(url, { params: data });
  }
  if (method === Method.POST) {
    return service.post(url, data);
  }
  if (method === Method.Download) {
    return service.get(url, { params: data, responseType: 'blob' });
  }
}

export default request
