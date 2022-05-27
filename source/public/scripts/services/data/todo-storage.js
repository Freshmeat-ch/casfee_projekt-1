export class TodoStorage {
    
    constructor() {
        const todos = JSON.parse(localStorage.getItem('todos') || JSON.stringify([]));
        this.todos = todos;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    add(todo) {
        this.todos.push(todo);
        this.persist();
    }
    
    update(todo) {
        this.todos.forEach((item, key) => { if (item.id === todo.id) this.todos[key] = todo });
        this.persist();
    }

    getId(id) {
        return this.todos.find(item => item.id === id);
    }

    getAll() {
        return this.todos;
    }

    persist() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        return this.todos;
    }

}

export const todoStorage = new TodoStorage();