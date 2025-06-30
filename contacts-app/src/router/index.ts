import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      alias: '/contact',
    },
    {
      path: '/contact/:id',
      name: 'singleContact',
      component: () => import('../views/SingleContactView.vue'),
    },
    {
      path: '/login',
      children: [
        {
          path: '',
          component: () => import('../views/LoginView.vue'),
          name: 'login',
        },
        {
          path: 'forgotPassword',
          name: 'forgotPassword',
          component: () => import('../views/ForgottenPasswordView.vue'),
        },
      ],
    },
    {
      path: '/changePassword/:token',
      name: 'changePassword',
      component: () => import('../views/ChangePasswordView.vue'),
    },
    {
      path: '/company',
      name: 'company',
      component: () => import('../views/CompanyManagementView.vue'),
    },
    {
      path: '/structure',
      name: 'structure',
      component: () => import('../views/StructureManagementView.vue'),
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: () => import('../views/AccountManagementView.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useUser()
        if (
          to.name == 'accounts' &&
          (userStore.userData?.record.expand.permissions_id.edit_permissions ||
            userStore.userData?.record.expand.permissions_id.delete_permissions)
        ) {
          next()
        } else {
          next(from.fullPath)
        }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'error404',
      component: () => import('../views/404PageNotFoundView.vue'),
    },
  ],
})

router.beforeEach((to, from) => {
  const userStore = useUser()
  if (
    (to.name == 'company' || to.name == 'structure' || to.name == 'accounts') &&
    userStore.userData == null
  ) {
    return { name: from.name }
  }
})

router.beforeEach((to, from) => {
  const userStore = useUser()
  if ((to.name == 'login' || to.name == 'forgotPassword') && userStore.userData != null) {
    return { name: from.name }
  }
})

export default router
