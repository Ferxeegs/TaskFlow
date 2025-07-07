<template>
  <div class="auth-container" :class="{ 'slide-left': isRegister }">
    <div class="decorative-panel">
      <div class="decorative-circles">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div class="logo">TaskFlow</div>
      <div class="decorative-text">
        <span v-if="!isRegister">
          Kelola tugas Anda dengan mudah dan efisien. Tingkatkan produktivitas tim dengan TaskFlow.
        </span>
        <span v-else>
          Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan TaskFlow.
        </span>
      </div>
    </div>

    <div class="auth-panel">
      <div class="form-container">
        <!-- Login Form -->
        <div v-if="!isRegister">
          <h1 class="form-title">Masuk</h1>
          <p class="form-subtitle">Selamat datang kembali!</p>
          
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                type="email" 
                v-model="loginForm.email" 
                class="form-input"
                :class="{ error: loginForm.errors.email }"
                placeholder="Masukkan email Anda"
                required
              >
              <span v-if="loginForm.errors.email" class="error-message">
                {{ loginForm.errors.email }}
              </span>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <input 
                type="password" 
                v-model="loginForm.password" 
                class="form-input"
                :class="{ error: loginForm.errors.password }"
                placeholder="Masukkan password Anda"
                required
              >
              <span v-if="loginForm.errors.password" class="error-message">
                {{ loginForm.errors.password }}
              </span>
            </div>
            
            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? 'Memproses...' : 'Masuk' }}
            </button>
          </form>
          
          <div class="toggle-link" @click="toggleMode">
            Belum punya akun? Daftar sekarang
          </div>
        </div>
        
        <!-- Register Form -->
        <div v-else>
          <h1 class="form-title">Daftar</h1>
          <p class="form-subtitle">Buat akun baru Anda</p>
          
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <input 
                type="text" 
                v-model="registerForm.name" 
                class="form-input"
                :class="{ error: registerForm.errors.name }"
                placeholder="Masukkan nama lengkap Anda"
                required
              >
              <span v-if="registerForm.errors.name" class="error-message">
                {{ registerForm.errors.name }}
              </span>
            </div>
            
            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                type="email" 
                v-model="registerForm.email" 
                class="form-input"
                :class="{ error: registerForm.errors.email }"
                placeholder="Masukkan email Anda"
                required
              >
              <span v-if="registerForm.errors.email" class="error-message">
                {{ registerForm.errors.email }}
              </span>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <input 
                type="password" 
                v-model="registerForm.password" 
                class="form-input"
                :class="{ error: registerForm.errors.password }"
                placeholder="Masukkan password Anda"
                required
              >
              <span v-if="registerForm.errors.password" class="error-message">
                {{ registerForm.errors.password }}
              </span>
            </div>
            
            <button type="submit" class="btn-primary" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? 'Memproses...' : 'Daftar' }}
            </button>
          </form>
          
          <div class="toggle-link" @click="toggleMode">
            Sudah punya akun? Masuk sekarang
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

// Router
const router = useRouter()

// Apollo mutations
const { mutate: loginMutation, loading: loginLoading } = useMutation(LOGIN_MUTATION)
const { mutate: registerMutation, loading: registerLoading } = useMutation(REGISTER_MUTATION)

// Reactive state
const isRegister = ref(false)
const successMessage = ref('')

const loginForm = reactive({
  email: '',
  password: '',
  errors: {} as Record<string, string>
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  errors: {} as Record<string, string>
})

// Computed
const loading = computed(() => loginLoading.value || registerLoading.value)

// Methods
const clearErrors = () => {
  loginForm.errors = {}
  registerForm.errors = {}
}

const clearForms = () => {
  loginForm.email = ''
  loginForm.password = ''
  registerForm.name = ''
  registerForm.email = ''
  registerForm.password = ''
}

const toggleMode = () => {
  isRegister.value = !isRegister.value
  clearErrors()
  successMessage.value = ''
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validateLoginForm = () => {
  const errors: Record<string, string> = {}
  
  if (!loginForm.email) {
    errors.email = 'Email wajib diisi'
  } else if (!validateEmail(loginForm.email)) {
    errors.email = 'Format email tidak valid'
  }
  
  if (!loginForm.password) {
    errors.password = 'Password wajib diisi'
  } else if (loginForm.password.length < 6) {
    errors.password = 'Password minimal 6 karakter'
  }
  
  loginForm.errors = errors
  return Object.keys(errors).length === 0
}

const validateRegisterForm = () => {
  const errors: Record<string, string> = {}
  
  if (!registerForm.name) {
    errors.name = 'Nama lengkap wajib diisi'
  } else if (registerForm.name.length < 2) {
    errors.name = 'Nama minimal 2 karakter'
  }
  
  if (!registerForm.email) {
    errors.email = 'Email wajib diisi'
  } else if (!validateEmail(registerForm.email)) {
    errors.email = 'Format email tidak valid'
  }
  
  if (!registerForm.password) {
    errors.password = 'Password wajib diisi'
  } else if (registerForm.password.length < 6) {
    errors.password = 'Password minimal 6 karakter'
  }
  
  registerForm.errors = errors
  return Object.keys(errors).length === 0
}

const handleLogin = async () => {
  if (!validateLoginForm()) return

  clearErrors()

  try {
    const result = await loginMutation({
      email: loginForm.email,
      password: loginForm.password
    })

    if (result?.data?.login) {
      const { token, user } = result.data.login
      
      // Simpan token dan user data ke localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Redirect ke dashboard
      router.push('/dashboard')
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Handle different error types
    if (error.message.includes('User not found')) {
      loginForm.errors.email = 'Email tidak ditemukan'
    } else if (error.message.includes('Invalid credentials')) {
      loginForm.errors.password = 'Password salah'
    } else {
      loginForm.errors.password = 'Terjadi kesalahan saat login'
    }
  }
}

const handleRegister = async () => {
  if (!validateRegisterForm()) return

  clearErrors()

  try {
    const result = await registerMutation({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password
    })

    if (result?.data?.register) {
      // Opsi 1: Langsung login dan redirect
      const { token, user } = result.data.register
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/dashboard')

      // Opsi 2: Tampilkan pesan sukses dan pindah ke login
    //   successMessage.value = 'Registrasi berhasil! Silakan login.'
    //   clearForms()
    //   isRegister.value = false
    }
  } catch (error: any) {
    console.error('Register error:', error)
    
    // Handle different error types
    if (error.message.includes('Email already registered')) {
      registerForm.errors.email = 'Email sudah terdaftar'
    } else {
      registerForm.errors.email = 'Terjadi kesalahan saat registrasi'
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 900px;
  height: 600px;
  position: relative;
  display: flex;
  margin: 0 auto;
  margin-top: 50px;
}

.auth-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 50px;
  position: relative;
  z-index: 2;
}

.decorative-panel {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 60px 50px;
  text-align: center;
}

.logo {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: white;
}

.decorative-text {
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 30px;
}

.decorative-circles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle:nth-child(1) {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.circle:nth-child(2) {
  width: 60px;
  height: 60px;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.circle:nth-child(3) {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.form-container {
  width: 100%;
  max-width: 350px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.form-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 40px;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #e74c3c;
  background: #fdf2f2;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 5px;
  display: block;
}

.btn-primary {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.toggle-link {
  text-align: center;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
}

.toggle-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.auth-container.slide-left .auth-panel {
  transform: translateX(-100%);
}

.auth-container.slide-left .decorative-panel {
  transform: translateX(-100%);
}

.auth-panel, .decorative-panel {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .auth-container {
    width: 95%;
    height: 500px;
    flex-direction: column;
  }
  
  .decorative-panel {
    flex: 0.4;
  }
  
  .auth-panel {
    flex: 0.6;
    padding: 40px 30px;
  }
}
</style>