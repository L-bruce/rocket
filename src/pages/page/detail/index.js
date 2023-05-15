import React, { Component } from 'react'
import styles from './index.scss'
import { getDetail } from '@/src/data/data'
import { Spin } from 'antd'
const path = 'https://www.w3school.com.cn/i/movie.ogg'

class Rocket extends Component {
    state = {
        loading: true,
        detail: {},
    }

    componentDidMount() {
        document.title = 'rocket_detail'
        const { id } = this.props.match.params
        console.log(this.props.match, 9999000)
        let opts = {}
        this.getData({ id })
        console.log(this.player)
    }

    handleStateChange(state, prevState) {
        console.log(state)
    }

    //拉数据
    getData(opts) {
        setTimeout(() => {
            const detail = getDetail(opts) //params作为请求的虚拟参数
            this.setState({
                loading: false,
                detail,
            })
        }, 1000)
    }

    render() {
        const { loading, detail } = this.state
        return (
            <div className={styles['detail-container']}>
                {loading ? (
                    <Spin />
                ) : (
                    <>
                        <video className="video" src={path} controls="controls">
                            your browser does not support the video tag
                        </video>
                        <p className="title">{detail.title}</p>
                        <p className="content">{detail.content}</p>
                    </>
                )}
            </div>
        )
    }
}

export default Rocket
