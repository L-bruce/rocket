import renderRoutes from '@/src/js/utils/renderRoutes'
import loadComponent from '@/src/components/load-component'

const homeRouter = [
    {
        path: '/index',
        component: loadComponent({
            loader: () => import(/* webpackChunkName:"index" */ '@/src/pages/page/rocket/index'),
        }),
        key: 'index',
    },
    {
        path: '/rocket',
        component: loadComponent({
            loader: () => import(/* webpackChunkName:"rocket" */ '@/src/pages/page/rocket/index'),
        }),
        key: 'rocket',
    },
    {
        path: '/detail',
        component: loadComponent({
            loader: () => import(/* webpackChunkName:"detail" */ '@/src/pages/page/detail/index'),
        }),
        key: 'rocket',
    },
    {
        path: '',
        component: loadComponent({
            loader: () => import(/* webpackChunkName:"index" */ '@/src/pages/page/rocket/index'),
        }),
        key: 'index',
    },
]

export default renderRoutes(homeRouter)
