/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
import { omit } from 'lodash'

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
    style: { width: 200, marginRight: 16 }
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
  shouldComponentUpdate (nextProps, nextState) {
    const { searchKey } = this.props
    // 监听数据源options的变化
    if (this.props.options !== nextProps.options) {
      this.setState({
        options: nextProps.options,
        optionList_: nextProps.options.slice(0, 100),
        optionList: nextProps.options.slice(0, 100),
        pageSize: 100,
        scrollPage: 1,
        keyWords: ''
      })
      return true
    }
    // 监听状态变化
    if (this.props.query[searchKey] !== nextProps.query[searchKey]) {
      this.setState({
        optionList: this.state.optionList_,
        keyWords: ''
      })
      return true
    }
    return true
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
    const { searchKey, query, action, id, clearKey, changleAction, mode, requestType } = this.props
    if (!value || value.length <= 0) {
      delete query[searchKey]
      // 重置下拉框状态
      this.setState({
        optionList: this.state.optionList_,
        keyWords: ''
      })
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

  filterOption = (inputValue, option) => {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  }

  render () {
    const { mode, searchKey, query, dropdownOpenSelectWidth,
      placeholder, defaultValue, loading, style, className, allowClear, disabled } = this.props
    const { optionList } = this.state
    const handleValue = mode && query[searchKey]
    ? query[searchKey].split(',')
    : query[searchKey]
    return (
      <Select
        value={handleValue}
        {...!!mode && { mode }}
        onChange={this.handleChange}
        showSearch
        filterOption={this.filterOption}
        dropdownMatchSelectWidth={!dropdownOpenSelectWidth}
        defaultValue={defaultValue}
        style={style}
        placeholder={`${optionList.length === 0 ? '东西有点多，请刷新一下重新加载～！' : placeholder}`}
        loading={loading}
        className={className}
        allowClear={allowClear}
        onBlur={this.handleBlur}
        getPopupContainer={triggerNode => triggerNode.parentNode}
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
