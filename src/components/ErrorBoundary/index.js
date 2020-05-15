import React from 'react'
import fundebug from 'fundebug-javascript'

fundebug.apikey = 'b9fd627072ebdf87dbd7fcfb96d3dcba5e8cfb3c775e3d11e0f3d50e5c8e356e'

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true })
    // 将component中的报错发送到Fundebug
    fundebug.notifyError(error, {
      metaData: {
        info: info
      }
    })
  }

  render () {
    if (this.state.hasError) {
      return null
      // Note: 也可以在出错的component处展示出错信息，返回自定义的结果。
    }
    return this.props.children
  }
}

export default ErrorBoundary
