import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TabBarLayout from '@/components/layout/TabBarLayout.vue'
import NotFound from '@/components/common/NotFound.vue'
import { authApi } from '@/api/auth'
import ArticleDetailView from '@/views/ArticleDetailView.vue'

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
          component: () => import('@/views/HomeView.vue'),
          meta: { requiresAuth: false }
        },
        {
          path: 'groups',
          name: 'groups',
          component: () => import('@/views/GroupsView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/views/MessagesView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'mine',
          name: 'mine',
          component: () => import('@/views/MineView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/register-info',
      name: 'register-info',
      component: () => import('@/views/RegisterInfoView.vue'),
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
      path: '/password-login',
      name: 'password-login',
      component: () => import('@/views/PasswordLoginView.vue'),
      meta: { requiresAuth: false, title: '密码登录' }
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
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { 
        requiresAuth: true,
        title: '我的收藏'
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { 
        requiresAuth: true,
        title: '设置'
      }
    },
    {
      path: '/member/:id',
      name: 'member-detail',
      component: () => import('@/views/MemberDetailView.vue'),
      meta: { 
        requiresAuth: false,
        title: '会员详情'
      }
    },
    {
      path: '/article/:id',
      name: 'ArticleDetail',
      component: ArticleDetailView,
      meta: {
        title: '文章详情'
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
  console.log('=== 🛣️ 路由守卫 ===')
  console.log('从:', from.fullPath)
  console.log('到:', to.fullPath)

  const authStore = useAuthStore()
  console.log('当前用户状态:', authStore)

  // 如果是需要登录的页面，检查登录状态
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({
      path: '/login',
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