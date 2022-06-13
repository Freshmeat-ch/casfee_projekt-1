import { Utils } from '../utils.js';

export class Todo {
  constructor(title, description, dueDate, id = null, createDate = new Date(), importance = 3, done = false) {
    this.id = id || Utils.generateId();
    this.title = title;
    this.description = description;
    this.importance = parseInt(importance, 10) || 3;
    this.createDate = createDate || new Date();
    this.dueDate = new Date(dueDate);
    this.dueDate.setHours(0, 0, 0, 0);
    this.done = done || false;
  }

  state() {
    const offsetInDays = this.dueDateOffsetInDays();
    switch (true) {
      case !this.done && offsetInDays < 0:
        return 'overdue';
      case !this.done && offsetInDays >= 0:
        return 'pending';
      default:
        return 'done';
    }
  }

  dueDateOffsetInDays() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((this.dueDate - today) / (24 * 60 * 60 * 1000)); // 24h * 60min * 60sek * 1000ms
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

  dueDateAsText() {
    switch (true) {
      case this.state() === 'done':
        return 'Erledigt';
      case this.dueDateOffsetInDays() < 0:
        return 'Überfällig';
      case this.dueDateOffsetInDays() === 0:
        return 'Heute';
      case this.dueDateOffsetInDays() === 1:
        return 'Morgen';
      case this.dueDateOffsetInDays() === 7:
        return 'In einer Woche';
      default:
        return this.dueDateHr();
    }
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
      done: this.done,
    };
  }
}
