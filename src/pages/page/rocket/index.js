import React, { Component } from 'react'
import { Button, Form, Input, Select, DatePicker, Col, Row } from 'antd'
import styles from './index.scss'
import getData from '@/src/data/data'
import Spin from '@/src/components/spin'
import { InfiniteScroll, List } from 'antd-mobile'
import { Link, Route } from 'react-router-dom'

const { RangePicker } = DatePicker

class Rocket extends Component {
    state = {
        loading: true,
        data: [],
        hasMore: true,
        params: {},
    }

    componentDidMount() {
        document.title = 'rocket'
        this.getData()
    }

    //表单点击拉数据
    onFinish(values) {
        console.log(values)
        this.setState({ params: values, loading: true })
        setTimeout(() => {
            const arr = getData(values) //params作为请求的虚拟参数
            this.setState({
                loading: false,
                data: arr,
                hasMore: true,
            })
        }, 1000)
    }

    //滑动拉数据
    getData() {
        const { data, params } = this.state
        console.log(getData, 111)
        const arr = getData(params) //params作为请求的虚拟参数

        setTimeout(() => {
            let newData = data.concat(arr)
            this.setState({
                loading: false,
                data: newData,
                hasMore: true,
            })
        }, 1000)
    }

    // onFinishFailed() {}

    renderDom() {
        const { data } = this.state
        return (
            <React.Fragment>
                {data.map((item, index) => {
                    return (
                        <div className="rocket" key={item.id}>
                            <img src={item.src} />
                            <p className="time">{item.date}</p>
                            <p className="title">{item.title}</p>
                            <Link className="list-group-item" to={`/detail/${item.id}`}>
                                <a className="button">详情</a>
                            </Link>
                        </div>
                    )
                })}
            </React.Fragment>
        )
    }

    render() {
        const { loading, hasMore } = this.state

        return (
            <div className={styles['rocket-container']}>
                <div className="rocket_search">
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            // maxWidth: 100%,
                            padding: 8,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={() => this.onFinish()}
                        // onFinishFailed={this.onFinishFailed}
                        autoComplete="off"
                    >
                        <Row>
                            <Col xs={24} sm={12}>
                                <Form.Item label="标题" name="title">
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="發射時間" name="date">
                                    <RangePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="sort" label="排序" initialValue={0}>
                                    <Select allowClear>
                                        <Option value={0}>發射時間由近到遠</Option>
                                        <Option value={1}>發射時間由遠到近</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label="發射狀態" name="status" initialValue={0}>
                                    <Select allowClear>
                                        <Select.Option value={0}>全部</Select.Option>
                                        <Select.Option value={1}>是</Select.Option>
                                        <Select.Option value={2}>否</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                    提交
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className="rocket-content">
                    <div className="content" ref={e => (this.scrollDom = e)}>
                        {loading ? <Spin /> : this.renderDom()}
                        {!loading & hasMore ? <InfiniteScroll loadMore={() => this.getData()} hasMore={true} /> : null}
                    </div>
                </div>
            </div>
        )
    }
}

export default Rocket
