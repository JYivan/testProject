import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Spin } from 'antd'

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
    const { children, baseProps, baseComponent, ...modalProps } = this.props

    const modal = (
      <Modal
        {...modalProps}
        confirmLoading={confirmLoading}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.hideModal}
      >
        <Spin spinning={confirmLoading}>
          {React.cloneElement(baseComponent, { ...baseProps, ...baseComponent.props })}
        </Spin>
      </Modal>
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
