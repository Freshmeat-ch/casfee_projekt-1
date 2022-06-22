export class TodoService {
  async create(todo) {
    console.log(todo);
    return fetch(`/todos/`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
  }

  async get(id) {
    return fetch(`/todos/${id}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
  }

  async update(id, todo) {
    return fetch(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
  }

  async delete(id) {
    return fetch(`/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
  }

  async getAll() {
    return fetch('/todos/', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json());
  }

  sortBy(todos, field, direction) {
    const sortedTodos = todos.sort((a, b) => {
      switch (field) {
        case 'title':
          return a[field].localeCompare(b[field]);
        default:
          if (a[field] === b[field]) {
            return 0;
          }
          if (a[field] === null) {
            return 1;
          }
          if (b[field] === null) {
            return -1;
          }
          return a[field] > b[field] ? 1 : -1;
      }
    });
    return direction === 'up' ? sortedTodos : sortedTodos.reverse();
  }
}
