import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router'

const routes: Array<
  RouteRecordRaw
> = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'todoList' },
  },
  {
    path: '/todo',
    name: 'todoList',
    component: () => import('../views/TodoListPage.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
