import * as R from 'ramda'
import { checkJwt } from '@/utils/helpers'
import Cookies from 'js-cookie'

class Session {
  static get (path) {
    try {
      const serializedState = localStorage.getItem('state')
      if (serializedState === null) {
        return undefined
      }
      const state = JSON.parse(serializedState)
      if (path) {
        return R.path(path)(state)
      }
      return state
    } catch (error) {
      return undefined
    }
  }

  static isExpired () {
    const token = Session.getToken()
    if (checkJwt(token)) {
      // 将jwt 写入cookies
      Cookies.set('ik', token, { expires: 9527, Domain: '.i2mago.com' })
      Cookies.set('ik', token, { expires: 9527, Domain: 'localhost' })
    }
    return !checkJwt(token)
  }

  static getRoles () {
    return Session.get(['app', 'roles'])
  }

  static getToken () {
    return Session.get(['app', 'token'])
  }

  static getUserInfo () {
    return Session.get(['app', 'user'])
  }
}

export default Session
