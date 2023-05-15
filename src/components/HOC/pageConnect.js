import hoistNonReactStatic from 'hoist-non-react-statics'

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const PageConnectHoc = Component => {
    class HoComponent extends React.Component {
        static displayName = `PageConnectHoc(${getDisplayName(Component)})`

        constructor(props) {
            super(props)

            this.state = {
                loading: false,
            }
        }

        render() {
            const { loading } = this.state

            return <Component {...this.props} csrInitLoading={loading} />
        }
    }

    // 拷贝静态方法
    hoistNonReactStatic(HoComponent, Component)

    return HoComponent
}

export default PageConnectHoc
