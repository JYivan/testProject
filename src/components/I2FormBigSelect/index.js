/* eslint-disable */
// 编辑状态存在 无法查看记录 bug
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
const Option = Select.Option
class I2FormHandleSelect extends React.Component {
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
    style: { width: '100%' }
  }
  constructor (props) {
    super(props)
    this.state = {
      options: this.props.options,
      optionList_: this.props.options.slice(0, 100),
      optionList: this.props.options.slice(0, 100),
      pageSize: 100,
      scrollPage: 1,
      keyWords: ''
    }
  }

  handleScroll = e => {
    e.persist()
    const { target } = e
    // scrollHeight：代表包括当前不可见部分的元素的高度
    // scrollTop：代表当有滚动条时滚动条向下滚动的距离，也就是元素顶部被遮住的高度
    // clientHeight：包括padding但不包括border、水平滚动条、margin的元素的高度
    const rmHeight = target.scrollHeight - target.scrollTop
    const clHeight = target.clientHeight
    // 当下拉框失焦的时候，也就是不下拉的时候
    if (rmHeight === 0 && clHeight === 0) {
      this.setState({ scrollPage: 1 })
    } else {
    // 当下拉框下拉并且滚动条到达底部的时候
    // 可以看成是分页，当滚动到底部的时候就翻到下一页
      if (rmHeight < clHeight + 5) {
        const { scrollPage } = this.state
        this.setState({ scrollPage: scrollPage + 1 })
        //调用处理数据的函数增加下一页的数据
        this.loadOption(scrollPage + 1)
      }
    }
  }
  
  loadOption = pageIndex => {
     const { value } = this.props
     const { pageSize, keyWords, options } = this.state
     // 通过每页的数据条数和页数得到总的需要展示的数据条数
     const newPageSize = pageSize * (pageIndex || 1)
     let newOptionsData = [], len // len 能展示的数据的最大条数
     if (options.length > newPageSize) {
       // 如果总数据的条数大于需要展示的数据
       len = newPageSize
     } else {
       // 否则
       len = options.length
     }
     // 如果有搜索的话，就走这里
     if (!!keyWords) {
       let data_ = options.filter(item => item.value.toLowerCase().indexOf(keyWords.toLowerCase()) > -1) || []
       data_.forEach((item, index) => {
         if (index < len) {
           newOptionsData.push(item)
         }
       })
     } else {
      options.forEach((item, index) => {
         if (index < len) {
           newOptionsData.push(item)
         }
       })
     }
     this.setState({ optionList: newOptionsData })
   }

  onSearch = val => {
    this.searchValue(val)
    this.setState({ keyWords: val })
  }
  searchValue = value => {
    const { options } = this.state
    let data_ = options.filter(item => item.value.toLowerCase().indexOf(value.toLowerCase()) > -1)
    if (data_.length > 100 || value === "") {
      data_ = data_.slice(0, 100)
    }
    this.setState({ optionList: data_ })
  }

  handleOnBlur = () => {
    this.setState({ optionList: this.state.optionList_ })
  }
 
  handleChange = (value, option) => {
    const { onChange } = this.props
    if (onChange) {
      onChange(value, option)
    }
  }

  filterOption = (inputValue, option) => {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  }

  render () {
    const { loading, style, className, allowClear, mode, placeholder, value, dropdownOpenSelectWidth, disabled } = this.props
    const { optionList } = this.state
    return (
      <Select
        style={style}
        placeholder={`${optionList.length === 0 ? '数据有点多，请刷新一下重新加载～！' : placeholder}`}
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
        onSearch= {this.onSearch}
        onPopupScroll={this.handleScroll}
      >
        {
          optionList.map(item => <Option key={item.id}>{item.value}</Option>)
        }
      </Select>
    )
  }
}

export default I2FormHandleSelect
