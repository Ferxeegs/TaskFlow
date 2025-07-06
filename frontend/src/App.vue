<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

// User data dari localStorage/store
const currentUser = ref({
  name: '',
  avatar: '👤'
})

const router = useRouter()

// Function untuk load user data dari localStorage
const loadUserData = () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    try {
      const user = JSON.parse(userData)
      currentUser.value = {
        name: user.name || user.username || 'User',
        avatar: user.avatar || '👤'
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }
}

// Function untuk handle logout
const handleLogout = () => {
  // Hapus data user dari storage/store
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  
  // Reset currentUser
  currentUser.value = {
    name: '',
    avatar: '👤'
  }
  
  // Redirect ke halaman login
  router.push('/login')
}

// Load user data saat komponen dimount
onMounted(() => {
  loadUserData()
})

// Get current route
const route = useRoute()

// Computed property untuk menentukan apakah navbar harus ditampilkan
const showNavbar = computed(() => {
  // Daftar halaman yang tidak menampilkan navbar
  const hiddenNavbarRoutes = ['/login', '/register', '/forgot-password']
  return !hiddenNavbarRoutes.includes(route.path)
})
</script>

<template>
  <!-- Header hanya tampil jika bukan halaman login -->
  <header v-if="showNavbar" class="modern-header">
    <div class="header-content">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-icon">
          <img src="/ic_task.png" alt="Task Icon" width="60" height="60" /> 
        </div>
        <div class="logo-text">
          <h1>TaskFlow</h1>
          <span>Manage your tasks efficiently</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="main-nav">
        <RouterLink to="/" class="nav-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Dashboard
        </RouterLink>
      </nav>

      <!-- User Section -->
      <div class="user-section">
        <div class="user-info">
          <span class="user-name">{{ currentUser.name }}</span>
        </div>
        <div class="user-avatar">
          <div class="avatar-circle">
            {{ currentUser.avatar }}
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn" title="Logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Main content dengan class dinamis -->
  <main :class="showNavbar ? 'main-content' : 'main-content-full'">
    <RouterView />
  </main>
</template>

<style scoped>
.modern-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-text span {
  font-size: 0.9rem;
  opacity: 0.8;
  font-weight: 400;
}

.main-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-link.router-link-exact-active {
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  text-align: right;
}

.user-name {
  display: block;
  font-weight: 600;
  font-size: 1rem;
}

.user-role {
  font-size: 0.85rem;
  opacity: 0.8;
}

.user-avatar {
  position: relative;
}

.avatar-circle {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.avatar-circle:hover {
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.main-content {
  min-height: calc(100vh - 100px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .logo-section {
    flex-direction: column;
    text-align: center;
  }
  
  .logo-text h1 {
    font-size: 1.5rem;
  }
  
  .user-section {
    order: -1;
  }
  
  .main-nav {
    gap: 1rem;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>