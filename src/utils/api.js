/* eslint-disable */
import axios from 'axios'
import * as R from 'ramda'
import { createBrowserHistory } from 'history'
import { message } from 'antd'
import Session from '@/utils/session'
import BasicConfig from '@/config/basic'
// import { objToFormData, objToQuerystring } from '@/utils/helpers'

// 声明一个数组用于存储每个请求的取消函数和axios标识
let pending = []
let cancelToken = axios.CancelToken
let removePending = (config) => {
  for (let p in pending) {
    // 当当前请求在数组中存在时执行函数体
    if (pending[p].u === config.url + '&' + config.method) {
      // 执行取消操作
      pending[p].f()
      pending.splice(p, 1)
    }
  }
}
const history = createBrowserHistory()

const formatResponse = response => {
  const { headers, data } = response
  if (/x-ms-excel/.test(headers['content-type'])) {
    const contentDisposition = headers['content-disposition'] || ''
    const [, fileName] = contentDisposition.split('=')
    return {
      fileName: fileName ? decodeURIComponent(fileName) : fileName,
      data
    }
  }
  if (data.code === 3) {
    history.push('/system/login')
    history.go('/system/login')
    return Promise.reject(data)
  }
  if (data.code === 0 || data.code === 1) {
    const meta = { ...R.dissoc('object', data), headers }
    return {
      data: data.object,
      meta
    }
  }
  message.error(data.message || 'error')
  return Promise.reject(data)
}

// default axios config
/* eslint-disable no-undef */
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/api'
} else {
  axios.defaults.baseURL = BasicConfig.domain
}

axios.defaults.headers.get['Cache-Control'] = 'no-cache'
axios.defaults.headers.get['Pragma'] = 'no-cache'
axios.defaults.withCredentials = true

// Add a request interceptor
/* eslint-disable no-undef */
axios.interceptors.request.use(
  config => {

    // 存在 killPending 属性时，执行http请求取消操作
    if (config.params && config.params.killPending) {
      removePending(config)
      config.cancelToken = new cancelToken((c) => {
        // 这里的axios标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
        pending.push({ u: config.url + '&' + config.method, f: c })
      })
    }

    if (Session.getToken()) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${Session.getToken()}`
      }
    }

    // 数据采用json方式提交
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    }

    // 数据采用formData方式提交
    // convert object body to FormData
    // if (config.data && config.method === 'post') {
    //   config.data = objToFormData(config.data)
    // }
    // // convert object body to URLSearchParams
    // if (config.data && config.method === 'put') {
    //   config.data = objToQuerystring(config.data)
    // }

    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
/* eslint-disable no-undef */
axios.interceptors.response.use(
  response => formatResponse(response),
  error => {
    // Do something with response error
    return Promise.reject(error)
  }
)

export default axios
