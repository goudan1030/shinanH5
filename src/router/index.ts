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
        requiresAuth: false,
        requiresSetup: true,
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
router.beforeEach(async (to, from, next) => {
  console.log('\n=== 🛣️ 路由守卫 ===')
  console.log('从:', from.path)
  console.log('到:', to.path)
  
  const authStore = useAuthStore()
  
  // 检查用户状态
  console.log('当前用户状态:', {
    isLoggedIn: authStore.isLoggedIn,
    user: authStore.user,
    needSetup: authStore.user?.needSetup,
    path: to.path
  })

  // 如果是设置页面，且有用户信息，允许访问
  if (to.name === 'setup-user' && authStore.user) {
    console.log('允许访问设置页面')
    next()
    return
  }

  // 如果用户需要设置账号信息，且目标不是设置页面，重定向到设置页面
  if (authStore.user?.needSetup && to.name !== 'setup-user') {
    console.log('用户需要设置账号信息，重定向到设置页面')
    next({
      name: 'setup-user',
      query: { phone: authStore.user?.phone }
    })
    return
  }

  // 处理需要登录的页面
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    console.log('需要登录的页面，重定向到登录页面')
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