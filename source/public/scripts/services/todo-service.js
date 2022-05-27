import { TodoStorage } from "./data/todo-storage.js";
import { Todo } from "./todo.js";

export class TodoService {

    constructor () {
        this.storage = new TodoStorage();
        this.todos = [];
    }

    get(id) {
       return this.storage.getId(id);
    }
    
    add(object) {
        const todo = new Todo(object.id, object.title, object.description, object.importance, object.createDate, object.dueDate, object.done);
        this.storage.add(todo);
        this.load();
        return todo;
    }
    
    update(id, object) {
        const todo = new Todo(id, object.title, object.description, object.importance, object.createDate, object.dueDate, object.done);
        this.storage.update(todo);
        this.load();
        return todo;
    }

    load() {
        this.todos = this.storage.getAll().map(todo => new Todo(todo.id, todo.title, todo.description, todo.importance, todo.createDate, todo.dueDate, todo.done));
    }
}

export const todoService = new TodoService();