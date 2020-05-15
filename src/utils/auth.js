/* eslint-disable */
import { store } from '@/index'
import BasicConfig from '@/config/basic'
import Session from '@/utils/session'
import { parseQueryString, objToSearch, checkJwt } from '@/utils/helpers'
import { appLogin } from '@/redux/app/actions'
import Cookies from 'js-cookie'

// 二维码登录
export function redirectLogin (url) {
  const fallBackUrl = url
    .replace('?', 'AAA')
    .replace('#', 'BBB')
    .replace(/&/g, 'CCC')
  window.location.href = `${BasicConfig.loginCodeUrl}?fallBackUrl=${fallBackUrl}`
}

// 密码登录
export function redirectLogin2 (url) {
  const fallBackUrl = url
    .replace('?', 'AAA')
    .replace('#', 'BBB')
    .replace(/&/g, 'CCC')
  window.location.href = `${BasicConfig.loginUrl}?fallBackUrl=${fallBackUrl}`
}

export function login (jwt, callback) {
  // 如果url中带有jwt参数，更新jwt
  const { search, pathname, origin } = window.location

  const loginUrl = `${origin}/system/login`
  const query = parseQueryString(search)
  const sesstionToken = Session.getToken()
  // 获取Cookies
  const getCookie = Cookies.get('ik')
  // 验证链接是否带有jwt
  if (checkJwt(query.jwt || jwt)) {

    Cookies.set('ik', query.jwt || jwt, { expires: 9527, Domain: '.i2mago.com' })
    Cookies.set('ik', query.jwt || jwt, { expires: 9527, Domain: 'localhost' })
    store.dispatch(appLogin(query.jwt || jwt))
    delete query.jwt
    window.location.href = `${pathname}${objToSearch(query)}`
    return
  }

  // 获取cookiesjwt
  if (getCookie) {
    // 验证cookiesJWt 是否过期
    if (checkJwt(getCookie)) {
      // cookies 与sesstion/redux jwt不一
      if (getCookie !== sesstionToken) {
        store.dispatch(appLogin(getCookie))
      }
      return callback()
    }
    // cookies jwt过期重新登陆
    window.location.href = loginUrl
    return 
  }
  // 如果jwt已过期，重新登录
  if (Session.isExpired()) {
    window.location.href = loginUrl
    return
  }
  return callback()
}
