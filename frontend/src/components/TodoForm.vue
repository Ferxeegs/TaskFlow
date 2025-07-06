<!-- <template>
  <div class="form-section">
    <h2>{{ isEditing ? 'Edit Tugas' : 'Tambah Tugas Baru' }}</h2>
    <form @submit.prevent="$emit('submit-todo')" class="todo-form">
      <div class="form-group">
        <label>Nama Tugas</label>
        <input v-model="todoToEdit.title" type="text" class="form-input" required />
      </div>

      <div class="form-group">
        <label>Deskripsi</label>
        <textarea v-model="todoToEdit.description" class="form-textarea" rows="3"></textarea>
      </div>

      <div class="form-group">
        <label>Deadline</label>
        <input v-model="todoToEdit.deadline" type="datetime-local" class="form-input" />
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn">
          {{ isEditing ? 'Update Tugas' : 'Tambah Tugas' }}
        </button>
        <button v-if="isEditing" type="button" class="cancel-btn" @click="$emit('cancel-edit')">
          Batal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
defineProps<{ isEditing: boolean, todoToEdit: any }>()
defineEmits(['submit-todo', 'cancel-edit'])
</script>

<style scoped>
@import '@/styles/home.css';
</style> -->