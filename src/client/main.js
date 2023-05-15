/* eslint-disable import/no-import-module-exports */
import 'core-js'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { App as AntdApp, ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Provider } from 'react-redux'
import AppErrorBoundary from '@/src/components/HOC/app-error-boundary'
import routes from '../routes'
import { getClientStore } from '../redux'
import customtheme from './theme.json'
import './index.scss'

if (module.hot) {
    module.hot.accept()
}
const store = getClientStore()

const App = () => {
    const isLoading = false

    const createRouter = router => {
        return (
            <Route
                exact={router.exact || false}
                key={router.key}
                path={`${router.path}${router.param || ''}`}
                component={router.component}
            />
        )
    }

    const RouteList = React.useMemo(() => {
        const RouterComponentList = []

        routes.forEach(router => {
            if (router.items && router.items.length) {
                router.items.forEach(childRouter => {
                    RouterComponentList.push(createRouter(childRouter))
                })
            } else {
                RouterComponentList.push(createRouter(router))
            }
        })

        return RouterComponentList
    }, [])

    return (
        <ConfigProvider theme={customtheme} locale={zhCN}>
            <AntdApp>
                {isLoading ? (
                    <div className="gpt-loaidng-wrap">
                        <Spin tip="请稍后~~~~" size="large" spinning={isLoading} delay={500} />
                    </div>
                ) : (
                    <BrowserRouter>
                        <Switch>
                            {RouteList}
                            <Redirect to="/404" />
                        </Switch>
                    </BrowserRouter>
                )}
            </AntdApp>
        </ConfigProvider>
    )
}

// 渲染app
const container = document.getElementById('app-root')
const RootApp = (
    <AppErrorBoundary>
        <Provider store={store}>
            <App />
        </Provider>
    </AppErrorBoundary>
)
const root = createRoot(container)

root.render(RootApp)
