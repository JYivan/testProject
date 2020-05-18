import React from 'react'
// import PropTypes from 'prop-types'
import { Select } from 'antd'
import { omit } from 'lodash'

const Option = Select.Option

class I2Select extends React.Component {
  // static propTypes = {
  //   style: PropTypes.object,
  //   query: PropTypes.object,
  //   className: PropTypes.string,
  //   placeholder: PropTypes.string,
  //   defaultValue: PropTypes.string,
  //   id: PropTypes.string, // 路径id
  //   clearKey: PropTypes.string, // 需要清除的属性 ”xx,xx“
  //   mode: PropTypes.string, // 选项模式
  //   requestType: PropTypes.string, // clear: 清除指定属性模式。 id: 路径方式查询模式。 clearID: 路径方式清除指定属性
  //   searchKey: PropTypes.string.isRequired, // 下拉框搜索条件key值
  //   allowClear: PropTypes.bool, // 允许清空
  //   loading: PropTypes.bool, // 数据加载状态
  //   dropdownOpenSelectWidth: PropTypes.bool, // 释放下拉选框宽度
  //   action: PropTypes.func, // 执行方法
  //   changleAction: PropTypes.func, // 联动设置
  //   options: PropTypes.array // 选项数据
  // }

  // static defaultProps = {
  //   style: { width: 200, marginRight: 16 },
  //   className: '',
  //   query: {},
  //   enterButton: false,
  //   options: [],
  //   action: () => {}
  // }

  handleChange = (value, option) => {
    const { searchKey, query, action, id, clearKey, changleAction, mode, requestType } = this.props
    if (!value || value.length <= 0) {
      delete query[searchKey]
    } else {
      if (mode) {
        query[searchKey] = value.join(',')
      } else {
        query[searchKey] = value
      }
    }
    if (changleAction) {
      changleAction(value, option)
    }

    if (action) {
      switch (requestType) {
        case 'id': {
          return action(id, { ...query, pageIndex: 1 })
        }
        case 'clear': {
          const formatKey = clearKey.split(',')
          const filterQuery = omit(query, formatKey)
          return action({ ...filterQuery, pageIndex: 1 })
        }
        case 'clearID': {
          const formatKey = clearKey.split(',')
          const filterQuery = omit(query, formatKey)
          return action(id, { ...filterQuery, pageIndex: 1 })
        }
        default: {
          return action({ ...query, pageIndex: 1 })
        }
      }
    }
  }

  filterOption (inputValue, option) {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  }

  render () {
    const { mode, options, searchKey, query, dropdownOpenSelectWidth,
      placeholder, defaultValue, loading, style, className, allowClear, disabled } = this.props
    const defaultQuery = query || {}
    const defaultStyle = style || { width: 200, marginRight: 16 }
    const defaultOption = options || []
    const defaultClassName = className || ''

    const handleValue = mode && defaultQuery[searchKey]
      ? defaultQuery[searchKey].split(',')
      : defaultQuery[searchKey]
    return (
      <Select
        value={handleValue}
        {...!!mode && { mode }}
        onChange={this.handleChange}
        showSearch
        filterOption={this.filterOption}
        dropdownMatchSelectWidth={!dropdownOpenSelectWidth}
        defaultValue={defaultValue}
        style={defaultStyle}
        placeholder={placeholder}
        loading={loading}
        className={defaultClassName}
        allowClear={allowClear}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        dropdownStyle={{ border: '1px solid #e8e8e8' }}
        disabled={disabled}
      >
        {
          defaultOption.map(item => <Option key={item.id}>{item.value}</Option>)
        }
      </Select>
    )
  }
}
export default I2Select
