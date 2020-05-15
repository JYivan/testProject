import React from 'react'
import PropTypes from 'prop-types'
import { Drawer, Spin, Button } from 'antd'

const noop = () => {}

class WrappedModal extends React.Component {
  state = {
    visible: false,
    confirmLoading: false
  };

  static propTypes = {
    baseComponent: PropTypes.element.isRequired,
    baseProps: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    mask: PropTypes.bool,
    maskClosable: PropTypes.bool,
    destroyOnClose: PropTypes.bool,
    closable: PropTypes.bool,
    footer: PropTypes.node,
    okText: PropTypes.string,
    okType: PropTypes.string,
    cancelText: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func
  };

  static defaultProps = {
    style: {},
    maskClosable: false,
    destroyOnClose: true,
    placement: 'right',
    okText: '确定',
    cancelText: '取消',
    onOk: noop,
    onCancel: noop
  };

  componentWillUnmount () {
    this.cancelled = true
  }

  showModal = e => {
    e.stopPropagation()
    this.setState({ visible: true })
  };

  hideModal = () => {
    const { onClose } = this.props
    if (onClose) {
      onClose()
    }
    this.setState({ visible: false })
  };

  handleOk = async () => {
    try {
      this.setState({ confirmLoading: true })
      await Promise.resolve(this.props.onOk())
      if (!this.cancelled) {
        this.setState({ confirmLoading: false, visible: false })
      }
    } catch (error) {
      this.setState({ confirmLoading: false })
      console.log('wrapModal handleOk error: ', error)
    }
  }

  render () {
    const { visible, confirmLoading } = this.state
    const { footer, okText, cancelText, children, baseProps, baseComponent, ...modalProps } = this.props
    const defaultFooter = (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          background: '#fff',
          borderRadius: '0 0 4px 4px'
        }}
      >
        <Button
          style={{
            marginRight: 8
          }}
          disabled={confirmLoading}
          onClick={this.hideModal}
        >
          {cancelText}
        </Button>
        <Button
          type="primary"
          loading={confirmLoading}
          disabled={confirmLoading}
          onClick={this.handleOk}
        >
          {okText}
        </Button>
      </div>
    )

    const modal = (
      <Drawer
        style={{
          height: 'calc(100%)',
          overflow: 'auto',
          paddingBottom: 53
        }}
        {...modalProps}
        visible={visible}
        onClose={this.hideModal}
      >
        <Spin spinning={confirmLoading}>
          {React.cloneElement(baseComponent, { ...baseProps, ...baseComponent.props })}
        </Spin>
        {footer || footer === null ? footer : defaultFooter}
      </Drawer>
    )

    return (
      <React.Fragment>
        {React.cloneElement(children, { key: 'tigger', onClick: this.showModal })}
        {modal}
      </React.Fragment>
    )
  }
}

export default WrappedModal
