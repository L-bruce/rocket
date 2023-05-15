import { useEffect } from 'react'
import { Empty, Spin } from 'antd'
import styles from './index.scss'

export type NotFoundPropsType = {
    loading?: boolean
}

const NotFound: React.FC<NotFoundPropsType> = props => {
    useEffect(() => {
        document.title = '404'
    }, [])

    return (
        <>
            {!props.loading && (
                <div className={styles['container']}>
                    <div className="main">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="" />
                        <div className="big-title">哎呀，我们没办法找到这个页面了</div>
                        <div className="sub-title">请检查您输入的网址是否正确，或者点击链接继续浏览</div>
                        <div className="link-title">
                            您可以回到<a href="/">首页</a>
                        </div>
                    </div>
                </div>
            )}
            {props.loading && (
                <div className={styles['container']}>
                    {/* loading效果，异步加载组件loading时可使用，为了体验效果，先注释掉 */}
                    <Spin size="large" />
                </div>
            )}
        </>
    )
}

export default NotFound
