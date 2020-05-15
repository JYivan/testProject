/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import permissionConfig from './config'
import permissionForConfig from './forConfig'

class Permission extends React.Component {
  static defaultProps = {
    rootPath: []
  }

  allowed = path => {
    let { roles, rootPath, forBank } = this.props
    roles = Array.isArray(roles) ? roles : []
    path = Array.isArray(path) ? path : [path]
    rootPath = Array.isArray(rootPath) ? rootPath : [rootPath]
    forBank = Array.isArray(forBank) ? forBank : []
    
    if (forBank.length > 0) {
      const allowedRoles = R.path(rootPath.concat(path), permissionForConfig)
      if (!allowedRoles || !Array.isArray(allowedRoles)) {
        return true
      }
      return allowedRoles.some(role => forBank.indexOf(role) > -1)
    }
    const allowedRoles = R.path(rootPath.concat(path), permissionConfig)
    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      return true
    }
    return allowedRoles.some(role => roles.indexOf(role) > -1)
  }

  renderChildren = children => {
    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child
      }
      const disabled = child.props.i2hidden !== 'true'
      const permissionpath = child.props.permissionfor || child.props.permissionpath
      const allowed = this.allowed(permissionpath)
      if (!disabled && !allowed) {
        return null
      }
      if (child.props.children) {
        const children = this.renderChildren(child.props.children)
        child = React.cloneElement(child, {
          ...(!allowed && { disabled: true }),
          children: children.length === 1 ? children[0] : children
        })
      }

      return child
    })
  }

  dualAllowed = (path, type) => {
    let { roles, rootPath, forBank, forBankTwo } = this.props
    roles = Array.isArray(roles) ? roles : []
    path = Array.isArray(path) ? path : [path]
    rootPath = Array.isArray(rootPath) ? rootPath : [rootPath]
    forBank = Array.isArray(forBank) ? forBank : []
    forBankTwo = Array.isArray(forBankTwo) ? forBankTwo : []

    if (type === 'roles') {
      const allowedRoles = R.path(rootPath.concat(path), permissionConfig)
      if (!allowedRoles || !Array.isArray(allowedRoles)) {
        return true
      }
      return allowedRoles.some(role => roles.indexOf(role) > -1)
    }

    if (type === 'forSecond') {
      const allowedRoles = R.path(rootPath.concat(path), permissionForConfig)
      if (!allowedRoles || !Array.isArray(allowedRoles)) {
        return true
      }
      return allowedRoles.some(role => forBankTwo.indexOf(role) > -1)
    }

    const allowedRoles = R.path(rootPath.concat(path), permissionForConfig)
    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      return true
    }
    return allowedRoles.some(role => forBank.indexOf(role) > -1)
  }

  reverseAllowed = (path) => {
    let { roles, rootPath } = this.props
    roles = Array.isArray(roles) ? roles : []
    path = Array.isArray(path) ? path : [path]
    rootPath = Array.isArray(rootPath) ? rootPath : [rootPath]
    const allowedRoles = R.path(rootPath.concat(path), permissionConfig)
    if (!allowedRoles || !Array.isArray(allowedRoles)) {
      return true
    }
    return allowedRoles.some(role => roles.indexOf(role) <= -1)
  }

  renderRepeatChildren = children => {
    // path: roles, for/fortwo: 为传入值
    return React.Children.map(children, child => {
      if (!React.isValidElement(child)) {
        return child
      }
      const disabled = child.props.i2hidden !== 'true'
      // oneData 获取指定传入数据‘for’作为匹配项
      const oneData = child.props.permissionfor
      // twoData 根据‘checktype’类型指定匹配路径是用path 还是 fortwo
      const twoData = child.props.checktype === 'oneData' ? child.props.permissionpath : child.props.permissionfortwo
      // threeData 加入方向对比方法，匹配路径暂时只适用path
      const threeData = child.props.checktype === 'threeData' ? this.reverseAllowed(child.props.permissionpath) : true
      const twoType = child.props.checktype === 'twoData' || child.props.checktype === 'threeData'
        ? 'forSecond'
        : 'roles'
      const allowedOne = this.dualAllowed(oneData, 'for')
      const allowedTwo = this.dualAllowed(twoData, twoType)
      // console.log('child.props.checktype', child.props.checktype, 'oneData', oneData, 'twoData', twoData, 'threeData', threeData)
      // console.log('allowedOne', allowedOne, 'allowedTwo', allowedTwo, 'threeData', threeData)

      if (!disabled && !allowedOne || !allowedTwo || !threeData) {
        return null
      }
      if (child.props.children) {
        const children = this.renderRepeatChildren(child.props.children)
        child = React.cloneElement(child, {
          ...(!allowedOne || !allowedTwo || !threeData && { disabled: true }),
          children: children.length === 1 ? children[0] : children
        })
      }
      return child
    })
  }

  render () {
    const { children, checktype } = this.props
    //是否启用多重验证或者启用自定义数据源验证
    if (checktype === 'repeat') {
      return this.renderRepeatChildren(children)
    }
    return this.renderChildren(children)
  }
}

const connectComponent = connect(
  state => ({
    roles: state.app.roles
  })
)(Permission)

export default connectComponent
