export class Todo {
    constructor(id, title, description, importance, createDate, dueDate, done) {
        this.id = id || this.generateId();
        this.title = title;
        this.description = description;
        this.importance = parseInt(importance, 10) || 3;
        this.createDate = createDate || new Date();
        this.dueDate = new Date(dueDate);
        this.done = done || false;
    }

    // eslint-disable-next-line class-methods-use-this
    generateId() {
        function randomChars(){
            return Math.random().toString(16).slice(-4);
          }
          return `${randomChars() + randomChars() + randomChars() }`;
    }

    dueDateHr() {
        const dueDate = new Date(this.dueDate);
        return `${String(dueDate.getDate()).padStart(2, '0')}.${String(dueDate.getMonth() + 1).padStart(2, '0')}.${String(dueDate.getFullYear())}`;
    }

    dueDateAsValue() {
        const dueDate = new Date(this.dueDate);
        return `${String(dueDate.getFullYear())}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            importance: this.importance,
            createDate: this.createDate,
            dueDate: this.dueDate,
            done: this.done
        };
    }
}

export const todo = new Todo();