import Loadable from 'react-loadable'
import NotFound from '@/src/pages/frame/not-found'

class Loading extends React.Component {
    render() {
        let result = null

        if (this.props.error) {
            result = <NotFound />
        } else if (this.props.timedOut) {
            result = <NotFound />
        } else if (this.props.pastDelay) {
            result = <NotFound loading />
        } else {
            result = null
        }

        return result
    }
}

export default opts => {
    return Loadable({
        loading: Loading,
        delay: 200,
        timeout: 10000,
        ...opts,
    })
}
