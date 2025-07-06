<!-- <template>
  <div class="tasks-section">
    <h2>Daftar Tugas</h2>
    <div class="filter-tabs">
      <button v-for="f in filters" :key="f" :class="['filter-tab', { active: activeFilter === f }]" @click="$emit('change-filter', f)">
        {{ capitalize(f) }}
      </button>
    </div>

    <div class="todo-grid">
      <div v-for="todo in todos" :key="todo.id" class="todo-card" :class="{ completed: todo.completed }">
        <div class="todo-header">
          <input type="checkbox" :checked="todo.completed" @change="$emit('toggle-complete', todo.id, !todo.completed)" />
          <h3>{{ todo.title }}</h3>
        </div>
        <p>{{ todo.description || 'Tidak ada deskripsi' }}</p>
        <p><strong>Deadline:</strong> {{ todo.deadline ? new Date(todo.deadline).toLocaleString() : '-' }}</p>
        <div class="todo-footer">
          <button @click="$emit('edit-todo', todo)">Edit</button>
          <button @click="$emit('delete-todo', todo.id)">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ todos: any[], activeFilter: string }>()
defineEmits(['toggle-complete', 'edit-todo', 'delete-todo', 'change-filter'])

const filters = ['all', 'pending', 'completed', 'overdue']
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
</script>

<style scoped>
@import '@/styles/home.css';
</style> -->