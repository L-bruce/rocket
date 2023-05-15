import React, { Component } from 'react'

import { Alert, Space, Spin } from 'antd'
import styles from './index.scss'

class Loading extends Component {
    render() {
        return (
            <div className={styles['loading-container']}>
                <Space
                    direction="vertical"
                    style={{
                        width: '100%',
                    }}
                >
                    <Space>
                        <Spin tip="Loading" size="large"></Spin>
                    </Space>
                </Space>
            </div>
        )
    }
}

export default Loading
