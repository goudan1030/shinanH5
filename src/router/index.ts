import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TabBarLayout from '@/components/layout/TabBarLayout.vue'
import HomeView from '@/views/HomeView.vue'
import RegisterInfoView from '@/views/RegisterInfoView.vue'
import axios from 'axios'
import NotFound from '@/components/common/NotFound.vue'

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
          component: HomeView
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
      meta: { 
        requiresAuth: false,
        title: '信息登记' 
      }
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
      meta: { 
        requiresAuth: true, 
        requiresSetup: false,
        title: '设置账号' 
      }
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: {
        requiresAuth: true,
        requiresSetup: false,
        title: '我的收藏'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: {
        requiresAuth: true,
        requiresSetup: false,
        title: '设置'
      }
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('@/views/UserProfileView.vue'),
      meta: {
        requiresAuth: true,
        requiresSetup: false,
        title: '个人信息'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: { requiresAuth: false }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log('\n=== 🛣️ 路由守卫 ===')
  console.log('从:', from.path)
  console.log('到:', to.path)
  
  const token = localStorage.getItem('token')
  console.log('当前 token:', token ? token.substring(0, 20) + '...' : '无')

  const authStore = useAuthStore()
  const userStatus = authStore.checkUserStatus()

  // 如果是临时用户，除了设置页面外，都重定向到设置页面
  if (userStatus === 'need-setup' && to.name !== 'setup-user') {
    console.log('临时用户访问其他页面，重定向到设置页面')
    next({
      name: 'setup-user',
      query: { phone: authStore.user?.phone }
    })
    return
  }

  // 如果是已激活用户访问设置页面，重定向到首页
  if (userStatus === 'active' && to.name === 'setup-user') {
    console.log('已激活用户访问设置页面，重定向到首页')
    next('/')
    return
  }

  // 需要登录的页面
  if (to.meta.requiresAuth && userStatus === 'not-logged-in') {
    console.log('未登录用户访问需要登录的页面，重定向到登录页')
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
    return
  }

  next()
})

// 添加标题更新
router.afterEach((to) => {
  const title = to.meta.title
  if (title) {
    document.title = `${title} - H5 Cloud`
  }
})

export default router 