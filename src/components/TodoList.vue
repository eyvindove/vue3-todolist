<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
} from 'vue'
import TodoListTab from '@/components/TodoListTab.vue'

interface TodoListItem {
  id: number,
  text: string,
  status: string,
  updatedAt: string,
}

const inputRef = ref<HTMLInputElement | null>(null)

const inputText = ref<string>('')
const clearInputText = () => inputText.value = ''

const showInputErrorMessage = ref<boolean>(false)
const checkInputText = () => {
  const trimmedInputText = inputText.value.trim()

  showInputErrorMessage.value = (!trimmedInputText && inputText.value !== '')
}

const activeTab = ref<string>('all')
const toggleActiveTab = (active: string) => {
  activeTab.value = active
}

const todoList: TodoListItem[] = reactive([])

const addTask = () => {
  const trimmedInputText = inputText.value.trim()

  if (!trimmedInputText) return
  todoList.push({
    id: new Date().getTime(),
    text: trimmedInputText,
    status: 'todo',
    updatedAt: new Date().toLocaleString(),
  })
  clearInputText()
  setLocalStorageTodoList()
}
const removeTask = (id: number) => {
  const removedList: TodoListItem[] = todoList.filter(item => item.id !== id)

  todoList.length = 0
  Object.assign(todoList, removedList)
  setLocalStorageTodoList()
}
const removeAllTasks = () => {
  const removedAllDoneList: TodoListItem[] = todoList.filter(item => item.status !== 'done')

  todoList.length = 0
  Object.assign(todoList, removedAllDoneList)
  setLocalStorageTodoList()
}

const filteredTodoList = computed<TodoListItem[]>(() => {
  if (activeTab.value === 'all') return todoList

  return todoList.filter(item => item.status === activeTab.value)
})

const canEdit = ref<boolean>(false)

const convertDateText = (date: string) => {
  return date.replace('上午', 'AM').replace('下午', 'PM')
}

const toggleStatus = (target: TodoListItem) => {
  todoList.forEach(item => {
    if (item.id === target.id) item.status = item.status === 'todo' ? 'done' : 'todo'
  })
}

const checkLocalStorageTodoList = () => {
  const localStorageTodoList: TodoListItem[] = JSON.parse(localStorage.getItem('_vue3-todo-list_list') || '[]')

  if (localStorageTodoList.length) Object.assign(todoList, localStorageTodoList)
}

const setLocalStorageTodoList = () => {
  localStorage.setItem('_vue3-todo-list_list', JSON.stringify(todoList))
}

onMounted(() => {
  inputRef.value?.focus()
  checkLocalStorageTodoList()
})
</script>

<template>
  <div>
    <div class="relative">
      <input
        ref="inputRef"
        v-model="inputText"
        class="
          block mx-auto px-3 py-2 peer
          w-full lg:w-1/2 rounded-lg border-2 border-solid border-cyan-700
          placeholder-transparent
          focus:outline-none
        "
        :class="{ 'border-red-700': showInputErrorMessage }"
        type="text"
        name="task"
        placeholder="New Task"
        @keyup.enter="addTask"
        @keyup="checkInputText"
        @blur="showInputErrorMessage = false"
      >
      <label
        class="
          absolute -top-4 left-2
          text-xs text-zinc-700 duration-300
          pointer-events-none
          peer-placeholder-shown:text-base
          peer-placeholder-shown:top-3
          peer-placeholder-shown:left-4
          peer-placeholder-shown:text-zinc-300
        "
        :class="{ 'text-red-700': showInputErrorMessage }"
        for="task"
      >
        New Task
      </label>
      <div
        v-show="showInputErrorMessage"
        class="absolute bottom-0 right-2 mt-1 text-xs text-red-700 duration-300"
      >
        Task name is invalid
      </div>
    </div>

    <TodoListTab
      :active="activeTab"
      @toggle-active="toggleActiveTab"
    />

    <div class="flex justify-end mt-2">
      <button
        v-if="canEdit && activeTab === 'done'"
        class="btn-primary mt-2 bg-red-900 hover:bg-red-700 transition"
        type="button"
        @click="removeAllTasks"
      >
        Remove All Done Tasks
      </button>

      <button
        class="btn-primary mt-2 ml-2"
        type="button"
        @click="canEdit = !canEdit"
      >
        {{ canEdit ? 'Close Edit' : 'Edit Tasks' }}
      </button>
    </div>

    <div class="my-2 min-h-[300px] max-h-[500px] overflow-y-scroll">
      <transition-group
        name="flip-list"
        tag="div"
      >
        <div v-if="!filteredTodoList.length">
          <p class="mt-8 text-center text-zinc-500">
            List is empty.
          </p>
        </div>

        <div
          v-for="item in filteredTodoList"
          :key="item.id"
          class="
            relative mt-2 px-4 py-2
            bg-slate-300 rounded cursor-pointer
          "
          :class="{ 'text-slate-500': item.status === 'done' }"
          @click="toggleStatus(item)"
        >
          <div class="flex grow break-all">
            <div :class="{ 'line-through': item.status === 'done' }">
              {{ item.text }}
            </div>

            <div
              class="flex gap-2 ml-auto transition"
              :class="{ 'opacity-0 pointer-events-none' : !canEdit }"
            >
              <button
                class="text-sm text-red-700 hover:text-red-500"
                type="button"
                @click.stop="removeTask(item.id)"
              >
                Remove
              </button>
            </div>
          </div>

          <div class="shrink-0 text-right text-sm text-slate-500 leading-4">
            {{ convertDateText(item.updatedAt) }}
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
