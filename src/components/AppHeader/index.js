/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Menu, Icon, Dropdown, Avatar } from 'antd'
import menus from './menus'
import { resetAppState } from '@/redux/app/actions'
import Cookies from 'js-cookie'

import './index.less'

const SubMenu = Menu.SubMenu

class AppHeader extends React.Component {
  logout = () => {
    const { history } = this.props
    this.props.resetAppState()
    history.push('/system/login')
    // 退出登陆设置 cookies 状态
    Cookies.set('ik', 'l_g', { expires: 9527, Domain: '.i2mago.com' })
    Cookies.set('ik', 'l_g', { expires: 9527, Domain: 'localhost' })
  }

  handleMenuClick = menu => {
    const { history } = this.props
    history.push(menu.key)
  }
  handlePMentClick = menu => {
    const { history } = this.props
    history.push(menu.path)
  }

  roleFilter = menu => {
    const { roles } = this.props
    const formatRoles = Array.isArray(roles)
    const defaultRoles = formatRoles ? roles : []
    if (!menu.roles) {
      return true
    }
    return menu.roles.some(key => defaultRoles.indexOf(key) > -1)
  }

  renderMenu = menu => {
    const title = (
      <span onClick={this.handlePMentClick.bind(this, menu)} style={{ display: 'block'}}>
        {menu.icon ? <Icon type={menu.icon} theme="outlined" /> : null}
        {menu.label}
      </span>
    )

    if (menu.children) {
      return (
        <SubMenu key={menu.path} title={title} >
          {
            menu.children
              .filter(item => this.roleFilter(item))
              .map(item => this.renderMenu(item))
          }
        </SubMenu>
      )
    }
    return (
      <Menu.Item key={menu.path} >
        {title}
      </Menu.Item>
    )
  }

  renderMenus = menus => {
    return menus
      .filter(menu => this.roleFilter(menu))
      .map(menu => this.renderMenu(menu))
  }

  render () {
    const { location: { pathname }, user } = this.props
    const menu = (
      <Menu className="menu">
        <Menu.Item key="logout" onClick={this.logout}>
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    )
    return (
      <header style={{ borderBottom: '1px solid #e8e8e8' }}>
        <div className="i2-app-header">
          <div className="logo" />
          <Menu
            style={{ borderBottom: 0 }}
            mode="horizontal"
            selectedKeys={[pathname]}
            defaultSelectedKeys={[`${pathname}`]}
            onClick={this.handleMenuClick}
          >
            {this.renderMenus(menus)}
          </Menu>
          <aside className="right">
            <Dropdown overlay={menu}>
              <span className="action account">
                <Avatar className="avatar" size="small" src={user.iconpath} />
                <span className="name">{user.enname}</span>
              </span>
            </Dropdown>
          </aside>
        </div>
      </header>
    )
  }
}

const connectAppHeader = connect(
  state => ({
    roles: state.app.roles,
    user: state.app.user
  }),
  { resetAppState }
)(AppHeader)

export default withRouter(connectAppHeader)
