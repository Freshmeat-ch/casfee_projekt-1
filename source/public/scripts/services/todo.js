import Utils from "../utils.js";

export class Todo {
    constructor(title, description, dueDate, id = null, createDate = new Date(), importance = 3, done = false) {
        this.id = id || Utils.generateId();
        this.title = title;
        this.description = description;
        this.importance = parseInt(importance, 10) || 3;
        this.createDate = createDate || new Date();
        this.dueDate = new Date(dueDate);
        this.done = done || false;
    }

    dueDateAsTimestamp() {
        const dueDate = new Date(this.dueDate);
        return Math.floor(dueDate.getTime() / 1000);
    }

    dueDateHr() {
        const dueDate = new Date(this.dueDate);
        return `${String(dueDate.getDate()).padStart(2, '0')}.${String(dueDate.getMonth() + 1).padStart(2, '0')}.${String(dueDate.getFullYear())}`;
    }

    dueDateAsValue() {
        const dueDate = new Date(this.dueDate);
        return `${String(dueDate.getFullYear())}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
    }

    createDateAsTimestamp() {
        const createDate = new Date(this.createDate);
        return Math.floor(createDate.getTime() / 1000);
    }

    createDateHr() {
        const createDate = new Date(this.createDate);
        return `${String(createDate.getDate()).padStart(2, '0')}.${String(createDate.getMonth() + 1).padStart(2, '0')}.${String(createDate.getFullYear())}`;
    }

    createDateAsValue() {
        const createDate = new Date(this.createDate);
        return `${String(createDate.getFullYear())}-${String(createDate.getMonth() + 1).padStart(2, '0')}-${String(createDate.getDate()).padStart(2, '0')}`;
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