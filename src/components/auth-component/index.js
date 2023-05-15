import hoistNonReactStatic from 'hoist-non-react-statics'
import { actions } from '@/src/redux/reducer/global'

const mapStateToProps = state => ({
    isLogin: state.global.isLogin,
    authStatus: state.global.authStatus,
})

const mapDispatchToProps = dispatch => ({
    modifyLoginStatus: opts => {
        return dispatch(actions.modifyLoginStatus(opts))
    },
    setLoginModal(data) {
        return dispatch(actions.setLoginModal(data))
    },
})

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const renderAuthComponent = function (Component) {
    class AuthComponent extends React.Component {
        static displayName = `AuthComponent(${getDisplayName(Component)})`

        state = {
            userInfo: {},
        }

        // eslint-disable-next-line react/no-deprecated
        UNSAFE_componentWillMount() {
            this.checkAuth()
        }

        // 验权
        checkAuth = () => {}

        render() {
            return <Component {...this.props} userInfo={this.state.userInfo} />
        }
    }

    hoistNonReactStatic(AuthComponent, Component)
    const ConnectAuthComponent = connect(mapStateToProps, mapDispatchToProps)(AuthComponent)

    return ConnectAuthComponent
}

export { renderAuthComponent }
