import { todoStore } from '../services/todo-store.js';

export class TodosController {
  async add(req, res) {
    return res.json(await todoStore.add(req.body));
  }

  async get(req, res) {
    return res.json(await todoStore.get(req.params.id));
  }

  async update(req, res) {
    return res.json(await todoStore.update(req.params.id, req.body));
  }

  async delete(req, res) {
    return res.json(await todoStore.delete(req.params.id));
  }

  async getAll(req, res) {
    return res.json((await todoStore.getAll()) || []);
  }
}

export const todosController = new TodosController();
