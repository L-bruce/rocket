import { Provider } from 'react-redux'
import NotFound from '@/src/pages/frame/not-found'
import { getClientStore } from '@/src/redux'

const store = getClientStore()

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)

        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        // console.log('APP getDerivedStateFromError', error)

        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true }
    }

    componentDidMount() {}

    componentDidCatch(error, errorInfo) {
        // 你同样可以将错误日志上报给服务器
        console.log('App componentDidCatch', error, errorInfo)
    }

    render() {
        // console.log('hasError', this.state.hasError)

        if (this.state.hasError) {
            // 你可以自定义降级后的 UI 并渲染
            return (
                <Provider store={store}>
                    <NotFound showNotFoundHeader />
                </Provider>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
