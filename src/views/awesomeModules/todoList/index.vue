<template>
	<div class="container">
		<section class="todoapp">
			<header class="header">
				<h1>todos</h1>
				<input
					class="new-todo"
					placeholder="What needs to be done?"
					autocomplete="off"
					autofocus
					v-model="input"
					@keyup.enter="addTodo"
				/>
			</header>
			<section class="main" v-show="totalCount">
				<input id="toggle-all" v-model="isAllDone" class="toggle-all" type="checkbox" />
				<label for="toggle-all">Mark all as complete</label>
				<ul class="todo-list">
					<li v-for="todo in filteredTodos" :key="todo.id" :class="{ editing: todo === editingTodo, completed: todo.completed }">
						<div class="view">
							<input class="toggle" type="checkbox" v-model="todo.completed" />
							<label @dblclick="editTodo(todo)">{{ todo.text }}</label>
							<button class="destroy" @click="remove(todo)"></button>
						</div>
						<input
							class="edit"
							type="text"
							v-editing-focus="todo === editingTodo"
							v-model="todo.text"
							@keyup.enter="doneEdit(todo)"
							@blur="doneEdit(todo)"
							@keyup.esc="cancelEdit(todo)"
						/>
					</li>
				</ul>
			</section>
			<footer class="footer" v-show="totalCount">
				<span class="todo-count">
					<strong>{{ remainingCount }}</strong>
					{{ remainingCount > 1 ? "items" : "item" }} left
				</span>
				<ul class="filters">
					<li><span @click="changeFilterType('all')">All</span></li>
					<li><span @click="changeFilterType('active')">Active</span></li>
					<li><span @click="changeFilterType('completed')">Completed</span></li>
				</ul>
				<!-- <ul class="filters">
        <li><a href="#/all">All</a></li>
        <li><a href="#/active">Active</a></li>
        <li><a href="#/completed">Completed</a></li>
        </ul> -->
				<button class="clear-completed" @click="removeCompleted" v-show="totalCount > remainingCount">Clear completed</button>
			</footer>
		</section>
		<footer class="info">
			<p>Double-click to edit a todo</p>
			<P>不管是学习react或vue, todolist是一个很经典的学习例子</P>
			<P>在示例中，用到的vue知识点就有：</P>
			<p>vue3 函数式编程，如何编写hooks, 本例的实现都是用hook函数实现</p>
			<p>computed 计算属性，善用计算属性的get和set如何简化操作</p>
			<p>ref 响应式</p>
			<p>watchEffect 用法</p>
			<p>vue 指令的使用</p>
			<p>声明周期钩子函数</p>
		</footer>
	</div>
</template>

<script setup lang="ts">
import { localGet, localSet } from "@/utils/util";
import { computed, ref, watchEffect } from "vue";
import type { Ref, Directive, DirectiveBinding } from "vue";

interface ITodoItem {
	id: string;
	text: string;
	completed: boolean;
}
type ITodosRef = Ref<ITodoItem[]>;

// 从本地读取 & 存储待办事项
const useStorage = () => {
	const KEY = "TODOS";
	const todos = ref<ITodoItem[]>(localGet(KEY) || []);
	// 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。
	watchEffect(() => {
		// todos是响应式数据，所以这里会和能监听其变化, 并且拿到的是变化后的值
		localSet(KEY, todos.value);
	});
	return todos;
};

// 添加待办
const useAdd = (todos: ITodosRef) => {
	const input = ref("");
	const addTodo = () => {
		const text = input.value && input.value.trim();
		if (!text) return;
		todos.value.unshift({
			id: Date.now().toString(),
			text,
			completed: false
		});
		input.value = "";
	};
	return {
		input,
		addTodo
	};
};

// 删除待办事项
const useRemove = (todos: ITodosRef) => {
	const remove = (todo: ITodoItem) => {
		const index = todos.value.indexOf(todo);
		todos.value.splice(index, 1);
	};

	const removeCompleted = () => {
		todos.value = todos.value.filter(todo => !todo.completed);
	};

	return {
		remove,
		removeCompleted
	};
};

// 编辑todos
const useEdit = (remove: (todo: ITodoItem) => void) => {
	let beforeTodoText = "";
	const editingTodo = ref<ITodoItem | null>(null);

	const editTodo = (todo: ITodoItem) => {
		beforeTodoText = todo.text;
		editingTodo.value = todo;
	};

	const doneEdit = (todo: ITodoItem) => {
		if (!editingTodo.value) return;
		todo.text = todo.text.trim();
		todo.text || remove(todo);
		editingTodo.value = null;
	};

	const cancelEdit = (todo: ITodoItem) => {
		editingTodo.value = null;
		todo.text = beforeTodoText;
	};

	return {
		editingTodo,
		editTodo,
		doneEdit,
		cancelEdit
	};
};

// 筛选过滤待办
const useFilter = (todos: ITodosRef) => {
	// 全选状态值
	const isAllDone = computed({
		get() {
			return !todos.value.some(todo => !todo.completed);
		},
		set(value: boolean) {
			return todos.value.forEach(todo => (todo.completed = value));
		}
	});
	// 过滤器
	const filter = {
		all: (list: ITodoItem[]) => list,
		active: (list: ITodoItem[]) => list.filter(todo => !todo.completed),
		completed: (list: ITodoItem[]) => list.filter(todo => todo.completed)
	};
	// 过滤类型
	const type = ref<"all" | "active" | "completed">("all");
	// 筛选出的待办
	const filteredTodos = computed(() => filter[type.value](todos.value));
	// 未完成（处于激活状态）待办数量
	const remainingCount = computed(() => filter.active(todos.value).length);
	// 待办总数量
	const totalCount = computed(() => todos.value.length);

	// 点击锚点，筛选待办
	const changeFilterType = (filterType: "all" | "active" | "completed") => {
		// 通过点击的锚点名称，获取过滤类型
		if (filter[filterType]) {
			type.value = filterType;
		} else {
			type.value = "all";
		}
	};

	// 有hash路由的情况下不要使用此方式
	//   const onHasChanged = () => {
	//   // 通过点击的锚点名称，获取过滤类型
	//   const hash = window.location.hash.replace('#/', '');
	//   if (filter[hash]) {
	//     type.value = hash;
	//   } else {
	//     type.value = 'all';
	//     window.location.hash = '';
	//   }
	// };
	// onMounted(() => {
	// 	// 首次加载执行一次，加载数据
	// 	onHasChanged();
	// 	window.addEventListener("hashchange", onHasChanged);
	// });
	// onUnmounted(() => {
	// 	window.removeEventListener("hashchange", onHasChanged);
	// });

	return {
		isAllDone,
		totalCount,
		filteredTodos,
		remainingCount,
		changeFilterType
	};
};

// 从本地读取初始化待办
const todos = useStorage();
const { input, addTodo } = useAdd(todos);
const { remove, removeCompleted } = useRemove(todos);
const { editingTodo, editTodo, cancelEdit, doneEdit } = useEdit(remove);
const { totalCount, remainingCount, isAllDone, filteredTodos, changeFilterType } = useFilter(todos);

// 自定义指令-自动获取焦点
const vEditingFocus: Directive = {
	mounted: (el: HTMLElement, binding: DirectiveBinding) => {
		binding.value && el.focus();
	},
	updated: (el: HTMLElement, binding: DirectiveBinding) => {
		binding.value && el.focus();
	}
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
