import { TodoStorage } from './data/todo-storage.js';
import { Todo } from './todo.js';

export class TodoService {
  constructor() {
    this.storage = new TodoStorage();
    this.todos = [];
  }

  get(id) {
    const object = this.storage.getId(id);
    return new Todo(object.title, object.description, object.dueDate, object.id, object.createDate, object.importance, object.done);
  }

  add(object) {
    const todo = new Todo(object.title, object.description, object.dueDate, object.id, object.createDate, object.importance, object.done);
    this.storage.add(todo);
    this.load();
    return todo;
  }

  update(id, object) {
    const todo = new Todo(object.title, object.description, object.dueDate, id, object.createDate, object.importance, object.done);
    this.storage.update(todo);
    this.load();
    return todo;
  }

  sortBy(field, direction) {
    const sortedTodos = this.todos.sort((a, b) => (a[field] > b[field] ? 1 : -1));
    return direction === 'up' ? sortedTodos : sortedTodos.reverse();
  }

  filterBy(field, value) {
    const filteredTodos = this.todos.filter((todo) => todo[field] === value);
    return filteredTodos;
  }

  load() {
    this.todos = this.storage.getAll().map((todo) => new Todo(todo.title, todo.description, todo.dueDate, todo.id, todo.createDate, todo.importance, todo.done));
  }
}
