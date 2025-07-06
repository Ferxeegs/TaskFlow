import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

const routes = [
  { 
    path: '/', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Home,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    name: 'LoginPage', 
    component: Login 
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard untuk proteksi route
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // Jika route memerlukan autentikasi tapi user belum login
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/login')
  }
  // Jika user sudah login dan mengakses halaman login, redirect ke dashboard
  else if ((to.name === 'Login' || to.name === 'LoginPage') && token) {
    next('/dashboard')
  }
  // Lainnya, lanjutkan navigasi
  else {
    next()
  }
})

export default router