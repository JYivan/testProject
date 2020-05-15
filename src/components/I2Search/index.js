import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'

const Search = Input.Search

class I2Search extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    searchKey: PropTypes.string.isRequired,
    query: PropTypes.object,
    enterButton: PropTypes.bool,
    action: PropTypes.func
  }

  static defaultProps = {
    style: { width: 200 },
    className: '',
    query: {},
    enterButton: false,
    action: () => {}
  }

  handleSearch = (value, option) => {
    const { searchKey, query, action, id, changleAction } = this.props
    if (!value) {
      delete query[searchKey]
    } else {
      query[searchKey] = value
    }
    if (changleAction) {
      changleAction(value, option)
    }
    if (id) {
      return action(id, { ...query, pageIndex: 1 })
    }
    action({ ...query, pageIndex: 1 })
  }

  render () {
    const { style, className, enterButton, placeholder, searchKey, query, disabled } = this.props
    return (
      <Search
        style={style}
        className={className}
        placeholder={placeholder}
        defaultValue={query[searchKey]}
        onSearch={this.handleSearch}
        enterButton={enterButton}
        disabled={disabled}
      />
    )
  }
}

export default I2Search
