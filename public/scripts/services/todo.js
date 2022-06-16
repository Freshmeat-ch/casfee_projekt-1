export class Todo {
  constructor(title, description, dueDate = null, importance = 3, done = false, createDate = new Date(), id = null) {
    this.title = title;
    this.description = description;
    this.importance = parseInt(importance, 10) || 3;
    this.createDate = createDate || new Date();
    this.dueDate = dueDate;
    if (dueDate !== null) {
      this.dueDate = new Date(dueDate);
      this.dueDate.setHours(0, 0, 0, 0);
    } else {
      this.dueDate = null;
    }
    this.done = done === 'true';
    this.id = id;
  }

  state() {
    const offsetInDays = this.dueDateOffsetInDays();
    switch (true) {
      case !this.done && this.dueDate === null:
      case !this.done && offsetInDays >= 0:
        return 'pending';
      case !this.done && offsetInDays < 0:
        return 'overdue';
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
    if (this.dueDate === null) return 0;
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
      case this.done === true:
        return 'Erledigt';
      case this.dueDate === null:
        return 'kein Datum';
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
      title: this.title,
      description: this.description,
      importance: this.importance,
      createDate: this.createDate,
      dueDate: this.dueDate,
      done: this.done,
    };
  }
}
