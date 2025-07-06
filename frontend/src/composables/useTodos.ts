// import { ref, computed, watchEffect } from 'vue'
// import { useQuery, useMutation } from '@vue/apollo-composable'
// import gql from 'graphql-tag'

// const GET_TODOS = gql`query { getTodos { id title description deadline completed created_at updated_at } }`
// const CREATE_TODO = gql`mutation($title: String!, $description: String, $deadline: String, $userId: ID!) { createTodo(title: $title, description: $description, deadline: $deadline, userId: $userId) { id } }`
// const UPDATE_TODO = gql`mutation($id: ID!, $title: String, $description: String, $deadline: String, $completed: Boolean) { updateTodo(id: $id, title: $title, description: $description, deadline: $deadline, completed: $completed) { id } }`
// const DELETE_TODO = gql`mutation($id: ID!) { deleteTodo(id: $id) }`

// export default function useTodos() {
//   const todos = ref<any[]>([])
//   const activeFilter = ref('all')
//   const isEditing = ref(false)
//   const editingTodo = ref<any>({ title: '', description: '', deadline: '', completed: false })

//   const { result, refetch } = useQuery(GET_TODOS)
//   const { mutate: createTodo } = useMutation(CREATE_TODO)
//   const { mutate: updateTodoMutation } = useMutation(UPDATE_TODO)
//   const { mutate: deleteTodo } = useMutation(DELETE_TODO)

//   watchEffect(() => {
//     if (result.value) todos.value = result.value.getTodos
//   })

//   const filteredTodos = computed(() => {
//     switch (activeFilter.value) {
//       case 'completed': return todos.value.filter(t => t.completed)
//       case 'pending': return todos.value.filter(t => !t.completed)
//       case 'overdue': return todos.value.filter(t => !t.completed && new Date(t.deadline) < new Date())
//       default: return todos.value
//     }
//   })

//   const createNewTodo = async () => {
//     if (!editingTodo.value.title.trim()) return
//     const deadline = editingTodo.value.deadline ? new Date(editingTodo.value.deadline).toISOString() : null
//     await createTodo({ title: editingTodo.value.title, description: editingTodo.value.description || null, deadline, userId: 1 })
//     resetForm(); await refetch()
//   }

//   const updateTodo = async () => {
//     const t = editingTodo.value
//     await updateTodoMutation({ id: t.id, title: t.title, description: t.description || null, deadline: t.deadline || null })
//     resetForm(); await refetch()
//   }

//   const toggleComplete = async (id: number, completed: boolean) => {
//     await updateTodoMutation({ id, completed }); await refetch()
//   }

//   const deleteTask = async (id: number) => {
//     if (confirm('Yakin ingin menghapus tugas ini?')) await deleteTodo({ id }); await refetch()
//   }

//   const editTodo = (todo: any) => {
//     isEditing.value = true
//     editingTodo.value = { ...todo, deadline: todo.deadline?.slice(0, 16) }
//   }

//   const cancelEdit = () => resetForm()

//   const resetForm = () => {
//     editingTodo.value = { title: '', description: '', deadline: '', completed: false }
//     isEditing.value = false
//   }

//   const setActiveFilter = (filter: string) => activeFilter.value = filter

//   return {
//     todos, activeFilter, filteredTodos,
//     isEditing, editingTodo,
//     createNewTodo, updateTodo, toggleComplete, deleteTask, editTodo, cancelEdit, setActiveFilter
//   }
// }