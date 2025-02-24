import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TabBarLayout from '@/components/layout/TabBarLayout.vue'
import HomeView from '@/views/HomeView.vue'
import RegisterInfoView from '@/views/RegisterInfoView.vue'
import axios from 'axios'
import NotFound from '@/components/common/NotFound.vue'
import { authApi } from '@/api/auth'

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
      name: 'register-info',
      component: RegisterInfoView,
      meta: { 
        requiresAuth: false,
        requiresSetup: true,
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
      path: '/member/:id',
      name: 'member-detail',
      component: () => import('@/views/MemberDetailView.vue'),
      meta: { 
        title: '会员详情',
        requiresAuth: false // 不需要登录也可以查看基本信息
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
  const currentStatus = {
    isLoggedIn: authStore.isLoggedIn,
    user: authStore.user,
    isNewUser: authStore.isNewUser,
    path: to.path
  }
  console.log('当前用户状态:', currentStatus)

  // 检查用户注册状态
  if (to.path === '/register-info' && authStore.isLoggedIn) {
    try {
      const res = await authApi.getRegistrationStatus()
      if (res.success && res.data.registered) {
        console.log('用户已登记信息，禁止访问注册页面')
        next(from.path)
        return
      }
    } catch (error) {
      console.error('检查用户注册状态失败:', error)
    }
  }

  // 如果是注册信息页面，且有用户信息，允许访问
  if (to.name === 'register-info' && authStore.user) {
    console.log('允许访问注册信息页面')
    next()
    return
  }

  // 如果是新用户，且目标不是注册信息页面，重定向到注册信息页面
  if (authStore.user?.isNewUser && to.name !== 'register-info') {
    console.log('新用户需要完善信息，重定向到注册信息页面')
    next({
      name: 'register-info',
      query: { phone: authStore.user?.phone }
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