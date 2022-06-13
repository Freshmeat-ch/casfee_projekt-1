export class TodosController {
  constructor() {
    this.mockData = [
      { id: '4f6ae2a7225c', title: 'safasd', description: 'fasdf asd fasd f', importance: 3, createDate: '2022-06-13T21:10:04.360Z', dueDate: '2022-06-19T22:00:00.000Z', done: false },
      { id: 'aaadeda8e7d8', title: 'tasdf', description: 'sasdfasd fas df', importance: 3, createDate: '2022-06-13T21:14:55.377Z', dueDate: '2022-06-28T22:00:00.000Z', done: false },
    ];
  }

  getAll = async (req, res) => {
    return res.json(this.mockData);
  };
}

export const todosController = new TodosController();
