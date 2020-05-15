/* eslint-disable */
import * as R from 'ramda'
import jwtDcode from 'jwt-decode'
import moment from 'moment'
import numeral from 'numeral'

export function promisify (fn) {
  return function (...args) {
    return new Promise(function (resolve, reject) {
      fn((error, values) => {
        if (error) {
          return reject(error)
        }
        resolve(values)
      })
    })
  }
}

export function objToFormData (obj = {}) {
  /* eslint-disable no-undef */
  const formData = new FormData()
  Object.keys(obj).forEach(key => {
    let item = obj[key]
    // 去掉前后空格
    if (typeof item === 'string') {
      item = item.trim()
    }
    if (Array.isArray(item)) {
      item.forEach(value => formData.append(key, fixNullVaue(value)))
    } else {
      formData.append(key, fixNullVaue(item))
    }
  })
  return formData
}

export function fixNullVaue (value) {
  /* eslint-disable */
  if (
    (typeof value === 'object' && !value) ||
    typeof value === 'null' ||
    typeof value === 'undefined'
  ) {
    return ''
  }
  return value
}

export function objToQuerystring (obj = {}) {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      R.merge(obj, (obj[key] = ''))
    }
  }
  return Object.keys(obj)
    .reduce((query, key) => query.concat(`${key}=${obj[key]}`), [])
    .join('&')
}

export function objToSearch (obj = {}) {
  const queryString = objToQuerystring(obj)
  return queryString ? `?${queryString}` : queryString
}

export function parseQueryString (search, key) {
  if (!search) {
    return key ? undefined : {}
  }

  search = search.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '')

  let query = {}
  const splits = search.split('&')

  splits.forEach(item => {
    const v = item.split('=')
    const name = decodeURIComponent(v.shift())
    const value = v.length ? decodeURIComponent(v.join('=')) : null

    if (Object.hasOwnProperty.call(query, name)) {
      if (typeof query[name] === 'string' || query[name] === null) {
        query[name] = [query[name]]
      }
      query[name] = value
    } else {
      query[name] = value
    }
  })

  return key ? query[key] : query
}

export function parseJwt (jwt) {
  try {
    return jwtDcode(jwt)
  } catch (error) {
    return null
  }
}

export function checkJwt (jwt) {
  try {
    const decodeJwt = parseJwt(jwt)
    if (decodeJwt) {
      return decodeJwt.exp > Math.ceil(Date.now() / 1000)
    }
    return false
  } catch (error) {
    return false
  }
}

export function getDateRangeList(startTimestamp, endTimestamp) {
  startTimestamp = +startTimestamp
  endTimestamp = +endTimestamp

  if (
    typeof startTimestamp !== 'number' &&
    typeof endTimestamp !== 'number' ||
    endTimestamp < startTimestamp
  ) {
    return []
  }

  const durationDays = moment.duration(endTimestamp - startTimestamp).as('day') + 1
  const dateRangeList = []

  for (let i = 0; i < durationDays; i++) {
    dateRangeList.push(moment(startTimestamp).add(i, 'days').format('YYYY-MM-DD'))
  }

  return dateRangeList
}

export function getDefaultMothPeriod () {
  const curDay = moment().get('date')
  if (curDay >= 15) {
    return [
      +moment().startOf('month').startOf('day'),
      +moment().endOf('month').startOf('day')
    ]
  } else {
    return [
      +moment().clone().subtract(1, 'months').startOf('month').startOf('day'),
      +moment().clone().subtract(1, 'months').endOf('month').startOf('day')
    ]
  }
}

export function getDefaultWeekPeriod () {
  const curWeekDay = moment().weekday()
  if (curWeekDay >= 2) {
    return [
      +moment().day(1).startOf('day'),
      +moment().day(7).startOf('day')
    ]
  } else {
    return [
      +moment().clone().day(-6).startOf('day'),
      +moment().clone().day(0).startOf('day')
    ]
  }
}

export function getDefaultlastWeekPeriod() {
  let testWeek = moment().day()
  const last_monday = moment().subtract( 4 * 7 + testWeek - 1, 'day')
  const last_sunday = moment().subtract(testWeek, 'day')
  return [+moment(last_monday).startOf('day'), +moment(last_sunday).startOf('day')]
}

export function formatNumberTo10kInt(num) {
  num = numeral(num/10000).format('0,0')
  return num
}

export function formatNumberTo10k(num) {
  num = numeral(num/10000).format('0,0')
  return num
}

export function formatAbsNumberTo10k(num) {
  return formatNumberTo10k(Math.abs(num))
}

export function formatNumber(number, exp = 1) {
  const f = parseFloat(number)
  if (isNaN(f)) {
    return Number(0).toFixed(exp)
  }
  return +f.toFixed(exp)
}

// 数据空值过滤
export function filterPickBy (query) {
  return R.pickBy((val, key) => val || val === 0, query)
}

export function getWeekPeriod() {
  return {
    startDate: +moment({ hour: 0, minute: 0, second: 0 }).weekday(0),
    endDate: +moment({ hour: 0, minute: 0, second: 0 }).weekday(6)
    // startDate: +moment().day(1).startOf('day'),
    // endDate: +moment().day(7).startOf('day')
  }
}
