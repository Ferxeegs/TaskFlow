<template>
  <section class="home">
    <div class="hero-section">
      <img src="/ic_task3.png" alt="Task Icon" width="60" height="60" class="task-icon" />
      <h1 class="page-title">
        Dashboard To-Do
      </h1>
      <p class="subtitle">
        Kelola tugas tim dengan mudah dan efisien. Tambahkan, selesaikan, dan lacak progress pekerjaan Anda!
      </p>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>{{ totalTasks }}</h3>
            <p>Total Tugas</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <h3>{{ completedTasks }}</h3>
            <p>Selesai</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <h3>{{ pendingTasks }}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-info">
            <h3>{{ overdueTasks }}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="form-section">
        <h2>{{ isEditing ? 'Edit Tugas' : 'Tambah Tugas Baru' }}</h2>
        <form @submit.prevent="isEditing ? updateTodo() : createNewTodo()" class="todo-form">
          <div class="form-group">
            <label for="title">Nama Tugas</label>
            <input 
              id="title"
              v-model="newTitle" 
              type="text" 
              placeholder="Nama tugas..." 
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea 
              id="description"
              v-model="newDescription" 
              placeholder="Deskripsi tugas (opsional)..." 
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="deadline">Deadline</label>
            <input 
              id="deadline"
              v-model="newDeadline" 
              type="datetime-local" 
              class="form-input"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="loading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="!isEditing" d="M12 5v14m-7-7h14"/>
                <path v-else d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path v-if="isEditing" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              {{ loading ? 'Processing...' : (isEditing ? 'Update Tugas' : 'Tambah Tugas') }}
            </button>
            
            <button 
              v-if="isEditing" 
              type="button" 
              class="cancel-btn"
              @click="cancelEdit"
            >
              Batal
            </button>
          </div>
        </form>
      </div>

      <div class="tasks-section">
        <h2>Daftar Tugas</h2>
        
        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <p>Memuat data...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="error-state">
          <p>Error: {{ error.message }}</p>
          <button @click="refetch" class="retry-btn">Coba Lagi</button>
        </div>

        <!-- Content -->
        <div v-else>
          <div class="filter-tabs">
            <button 
              :class="['filter-tab', { active: activeFilter === 'all' }]"
              @click="setActiveFilter('all')"
            >
              Semua ({{ totalTasks }})
            </button>
            <button 
              :class="['filter-tab', { active: activeFilter === 'pending' }]"
              @click="setActiveFilter('pending')"
            >
              Pending ({{ pendingTasks }})
            </button>
            <button 
              :class="['filter-tab', { active: activeFilter === 'completed' }]"
              @click="setActiveFilter('completed')"
            >
              Selesai ({{ completedTasks }})
            </button>
            <button 
              :class="['filter-tab', { active: activeFilter === 'overdue' }]"
              @click="setActiveFilter('overdue')"
            >
              Overdue ({{ overdueTasks }})
            </button>
          </div>

          <div class="todo-grid">
            <div 
              v-for="todo in filteredTodos" 
              :key="todo.id"
              class="todo-card"
              :class="{ 
                completed: todo.completed,
                overdue: isOverdue(todo.deadline) && !todo.completed
              }"
            >
              <div class="todo-header">
                <label class="checkbox-container">
                  <input
                    type="checkbox"
                    :checked="todo.completed"
                    @change="toggleComplete(todo.id, !todo.completed)"
                  />
                  <span class="checkmark"></span>
                </label>
                <h3 class="todo-title" :class="{ done: todo.completed }">
                  {{ todo.title }}
                </h3>
                <div class="priority-indicator" v-if="isOverdue(todo.deadline) && !todo.completed">
                  🔴
                </div>
              </div>
              
              <div class="todo-body">
                <p class="todo-description" v-if="todo.description">
                  {{ todo.description }}
                </p>
                <p class="todo-description no-desc" v-else>
                  <em>Tidak ada deskripsi</em>
                </p>
                
                <div class="todo-deadline" v-if="todo.deadline">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span :class="{ 'overdue-text': isOverdue(todo.deadline) && !todo.completed }">
                    {{ formatDeadline(todo.deadline) }}
                  </span>
                </div>
              </div>
              
              <div class="todo-footer">
                <div class="todo-status">
                  <span :class="['status-badge', getStatusClass(todo)]">
                    {{ getStatusText(todo) }}
                  </span>
                </div>
                <div class="todo-actions">
                  <button 
                    class="action-btn edit-btn" 
                    @click="editTodo(todo)"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    class="action-btn delete-btn" 
                    @click="deleteTask(todo.id)"
                    title="Hapus"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredTodos.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>Tidak ada tugas</h3>
            <p>{{ getEmptyStateMessage() }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      description
      deadline
      completed
      created_at
      updated_at
    }
  }
`

const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String, $deadline: String, $userId: ID!) {
    createTodo(title: $title, description: $description, deadline: $deadline, userId: $userId) {
      id
      title
      description
      deadline
      completed
      created_at
      updated_at
    }
  }
`

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $completed: Boolean, $title: String, $description: String, $deadline: String) {
    updateTodo(id: $id, completed: $completed, title: $title, description: $description, deadline: $deadline) {
      id
      title
      description
      deadline
      completed
      updated_at
    }
  }
`

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`

// Reactive variables
const newTitle = ref('')
const newDescription = ref('')
const newDeadline = ref('')
const todos = ref<any[]>([])
const activeFilter = ref('all')
const isEditing = ref(false)
const editingTodo = ref<any>(null)

// GraphQL composables
const { result, loading, error, refetch } = useQuery(GET_TODOS, {}, {
  errorPolicy: 'all'
})

const { mutate: createTodo, loading: createLoading } = useMutation(CREATE_TODO)
const { mutate: updateTodoMutation, loading: updateLoading } = useMutation(UPDATE_TODO)
const { mutate: deleteTodo, loading: deleteLoading } = useMutation(DELETE_TODO)

// Watch for data changes
watchEffect(() => {
  if (result.value && result.value.getTodos) {
    todos.value = result.value.getTodos
    console.log('Updated todos:', todos.value)
  }
})

// Debug logging
onMounted(() => {
  console.log('Component mounted')
  console.log('Initial loading state:', loading.value)
  console.log('Initial error state:', error.value)
})

// Computed properties
const totalTasks = computed(() => todos.value.length)
const completedTasks = computed(() => todos.value.filter(todo => todo.completed).length)
const pendingTasks = computed(() => todos.value.filter(todo => !todo.completed).length)
const overdueTasks = computed(() => 
  todos.value.filter(todo => !todo.completed && isOverdue(todo.deadline)).length
)

const filteredTodos = computed(() => {
  switch (activeFilter.value) {
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    case 'pending':
      return todos.value.filter(todo => !todo.completed)
    case 'overdue':
      return todos.value.filter(todo => !todo.completed && isOverdue(todo.deadline))
    default:
      return todos.value
  }
})

// Utility functions yang diperbaiki
const isOverdue = (deadline : any) => {
  if (!deadline) return false
  
  // Konversi string timestamp ke number, lalu ke Date
  const deadlineDate = new Date(parseInt(deadline))
  const now = new Date()
  
  // Validasi apakah date valid
  if (isNaN(deadlineDate.getTime())) {
    console.warn('Invalid deadline format:', deadline)
    return false
  }
  
  return deadlineDate < now
}

const formatDeadline = (deadline : any) => {
  if (!deadline) return ''
  
  // Konversi string timestamp ke number, lalu ke Date
  const date = new Date(parseInt(deadline))
  
  // Validasi apakah date valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid deadline format:', deadline)
    return 'Invalid Date'
  }
  
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hari ini'
  if (diffDays === 1) return 'Besok'
  if (diffDays === -1) return 'Kemarin'
  if (diffDays < 0) return `${Math.abs(diffDays)} hari lalu`
  if (diffDays < 7) return `${diffDays} hari lagi`
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fungsi helper untuk konversi datetime-local ke timestamp
const convertToTimestamp = (datetimeLocal : any) => {
  if (!datetimeLocal) return null
  
  const date = new Date(datetimeLocal)
  if (isNaN(date.getTime())) return null
  
  // Konversi ke timestamp dalam milliseconds sebagai string
  return date.getTime().toString()
}

// Fungsi helper untuk konversi timestamp ke datetime-local format
const convertToDatetimeLocal = (timestamp : any) => {
  if (!timestamp) return ''
  
  const date = new Date(parseInt(timestamp))
  if (isNaN(date.getTime())) return ''
  
  // Format untuk input datetime-local (YYYY-MM-DDTHH:mm)
  return date.toISOString().slice(0, 16)
}

const getStatusClass = (todo: any) => {
  if (todo.completed) return 'completed'
  if (isOverdue(todo.deadline)) return 'overdue'
  return 'pending'
}

const getStatusText = (todo: any) => {
  if (todo.completed) return 'Selesai'
  if (isOverdue(todo.deadline)) return 'Overdue'
  return 'Pending'
}

// Methods
const createNewTodo = async () => {
  if (!newTitle.value.trim()) return
  
  try {
    const result = await createTodo({ 
      title: newTitle.value, 
      description: newDescription.value || null,
      deadline: newDeadline.value, // Konversi ke timestamp
      userId: "1"
    })
    
    console.log('Created todo:', result)
    resetForm()
    await refetch()
  } catch (error) {
    console.error('Error creating todo:', error)
    alert('Gagal membuat tugas. Silakan coba lagi.')
  }
}

const updateTodo = async () => {
  if (!editingTodo.value || !newTitle.value.trim()) return
  
  try {
    const result = await updateTodoMutation({ 
      id: editingTodo.value.id,
      title: newTitle.value,
      description: newDescription.value || null,
      deadline: newDeadline.value
    })
    
    console.log('Updated todo:', result)
    resetForm()
    await refetch()
  } catch (error) {
    console.error('Error updating todo:', error)
    alert('Gagal mengupdate tugas. Silakan coba lagi.')
  }
}

const toggleComplete = async (id: string, completed: boolean) => {
  try {
    const result = await updateTodoMutation({ 
      id, 
      completed 
    })
    
    console.log('Toggled todo:', result)
    await refetch()
  } catch (error) {
    console.error('Error toggling todo:', error)
    alert('Gagal mengubah status tugas. Silakan coba lagi.')
  }
}

const deleteTask = async (id: string) => {
  if (confirm('Yakin ingin menghapus tugas ini?')) {
    try {
      const result = await deleteTodo({ id })
      console.log('Deleted todo:', result)
      await refetch()
    } catch (error) {
      console.error('Error deleting todo:', error)
      alert('Gagal menghapus tugas. Silakan coba lagi.')
    }
  }
}

const editTodo = (todo : any) => {
  isEditing.value = true
  editingTodo.value = todo
  newTitle.value = todo.title
  newDescription.value = todo.description || ''
  newDeadline.value = convertToDatetimeLocal(todo.deadline) // Konversi dari timestamp
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  newTitle.value = ''
  newDescription.value = ''
  newDeadline.value = ''
  isEditing.value = false
  editingTodo.value = null
}

const setActiveFilter = (filter: string) => {
  activeFilter.value = filter
}

const getEmptyStateMessage = () => {
  switch (activeFilter.value) {
    case 'completed':
      return 'Belum ada tugas yang selesai. Ayo selesaikan beberapa tugas!'
    case 'pending':
      return 'Semua tugas sudah selesai! Kerja bagus! 🎉'
    case 'overdue':
      return 'Tidak ada tugas yang overdue. Kerja bagus! 👍'
    default:
      return 'Belum ada tugas. Mulai dengan menambahkan tugas pertama Anda!'
  }
}
</script>

<style src="@/styles/home.css"></style>