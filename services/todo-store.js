import Datastore from 'nedb-promises';

export class TodoStore {
  constructor(db) {
    this.db = db || new Datastore({ filename: './data/orders.db', autoload: true });
  }

  async add(todo) {
    return this.db.insert(todo);
  }

  async get(id) {
    return this.db.findOne({ _id: id });
  }

  async update(id, todo) {
    return this.db.update({ _id: id }, { $set: todo });
  }

  async delete(id) {
    return this.db.remove({ _id: id });
  }

  async getAll() {
    return this.db.find().exec();
  }
}

export const todoStore = new TodoStore();
