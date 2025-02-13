import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TabBarLayout from '@/components/layout/TabBarLayout.vue'
import HomeView from '@/views/HomeView.vue'
import RegisterInfoView from '@/views/RegisterInfoView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: TabBarLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'groups',
          name: 'groups',
          component: () => import('@/views/GroupsView.vue')
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/views/MessagesView.vue')
        },
        {
          path: 'mine',
          name: 'mine',
          component: () => import('@/views/MineView.vue')
        }
      ]
    },
    {
      path: '/register-info',
      name: 'registerInfo',
      component: () => import('@/views/RegisterInfoView.vue'),
      meta: { title: '信息登记' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false, title: '登录' }
    },
    {
      path: '/verify-code',
      name: 'verify-code',
      component: () => import('@/views/VerifyCodeView.vue'),
      meta: { requiresAuth: false, title: '验证码' }
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('@/views/PrivacyPolicyView.vue'),
      meta: { requiresAuth: false, title: '隐私政策' }
    },
    {
      path: '/terms-of-service',
      name: 'terms-of-service',
      component: () => import('@/views/TermsOfServiceView.vue'),
      meta: { requiresAuth: false, title: '用户协议' }
    },
    {
      path: '/password-login',
      name: 'password-login',
      component: () => import('@/views/PasswordLoginView.vue'),
      meta: { requiresAuth: false, title: '密码登录' }
    },
    {
      path: '/setup-user',
      name: 'setup-user',
      component: () => import('@/views/SetupUserView.vue'),
      meta: { requiresAuth: true, title: '设置账号' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: false, title: '页面未找到' }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.token) {
    // 需要认证但未登录，重定向到登录页
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.token) {
    // 已登录但访问登录页，重定向到用户中心
    next({ name: 'user-center' })
  } else {
    next()
  }
})

// 添加标题更新
router.afterEach((to) => {
  const title = to.meta.title
  if (title) {
    document.title = `${title} - H5 Cloud`
  }
})

export default router 