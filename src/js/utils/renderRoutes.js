import PageConnectHoc from '@/src/components/HOC/pageConnect'
import { renderAuthComponent } from '@/src/components/auth-component'

const renderRoutes = routeList => {
    return routeList.map(item => {
        const SourceComponent = PageConnectHoc(item.component)
        const base = {
            ...item,
            loadData: SourceComponent.loadData,
        }

        if (item.routes && item.routes.length > 0) {
            return {
                ...base,
                component: SourceComponent,
                routes: renderRoutes(item.routes),
            }
        }

        return {
            ...base,
            component: renderAuthComponent(SourceComponent),
        }
    })
}

export default renderRoutes
