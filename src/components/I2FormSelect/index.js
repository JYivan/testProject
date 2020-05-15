import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
const Option = Select.Option

class FormSelect extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    mode: PropTypes.string, // 选项模式
    allowClear: PropTypes.bool, // 允许清空
    dropdownOpenSelectWidth: PropTypes.bool, // 释放下拉选框宽度
    options: PropTypes.array // 选项数据
  }

  static defaultProps = {
    className: '',
    enterButton: false,
    options: [],
    style: { width: '100%' }
  }

  handleChange = (value, option) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(value, option)
    }
  }

  handleBlur = (value) => {
    const { onBlur } = this.props
    if (onBlur) {
      onBlur(value)
    }
  }

  filterOption = (inputValue, option) => {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  }
  // 减少不必要的渲染
  shouldComponentUpdate (nextProps, nextState) {
    const { shouldUpdate } = this.props
    if (shouldUpdate) {
      if (this.props.value !== nextProps.value) {
        return true
      }
      return false
    }
    return true
  }

  render () {
    const { loading, style, className, allowClear, mode, placeholder, options, value, dropdownOpenSelectWidth, disabled } = this.props
    return (
      <Select
        style={style}
        placeholder={placeholder}
        showSearch
        value={value}
        loading={loading}
        className={className}
        allowClear={allowClear}
        {...!!mode && { mode }}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        filterOption={this.filterOption}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        dropdownMatchSelectWidth={!dropdownOpenSelectWidth}
        disabled={disabled}
      >
        {
          options.map(item => <Option key={item.id}>{item.value}</Option>)
        }
      </Select>
    )
  }
}

export default FormSelect
