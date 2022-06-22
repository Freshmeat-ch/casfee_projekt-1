import { TodoService } from '../services/todo-service.js';
import { Todo } from '../services/todo.js';
import { todoView } from '../views/todo-view.js';

export default class TodoController {
  constructor() {
    this.todoService = new TodoService();
    this.todos = [];

    // sortings & filters defaults
    this.sortBy = 'dueDate';
    this.sortDirection = 'up';
    this.filterDone = 'no';
    this.filterDoneState = 'inactive';
    this.filterOverdue = 'no';
    this.filterOverdueState = 'inactive';

    // containers
    this.body = document.querySelector('body');
    this.appContainer = document.querySelector('div#app');
    this.appListItemsContainer = document.querySelector('div#app-list-items > ol');

    // forms
    this.form = document.querySelector('div#app-form > form');

    // inputs
    this.inputDueDate = document.querySelector('input#form-dueDate');

    // buttons
    this.buttonSwitchTheme = document.querySelector('button#app-actions-switchTheme');
    this.buttonForm = document.querySelector('button#app-actions-form');
    this.buttonList = document.querySelector('button#app-form-action-list');
    this.buttonDelete = document.querySelector('button#app-form-action-delete');
    this.buttonSortByDefault = document.querySelector(`button[data-sort-by=${this.sortBy}]`);
    this.buttonFilterDone = document.querySelector('button[id=filterByDone]');
    this.buttonFilterOverdue = document.querySelector('button[id=filterByOverdue]');

    // buttons: all
    this.buttonsSortBy = document.querySelectorAll('button[id^=sortBy]');
  }

  initEventHandlers() {
    this.buttonSwitchTheme.addEventListener('click', () => {
      this.body.classList.toggle('dark');
    });

    this.buttonForm.addEventListener('click', async () => {
      this.clearForm();
      this.changeAction('form');
    });

    this.buttonList.addEventListener('click', async () => {
      this.clearForm();
      await this.changeAction('list');
    });

    this.buttonDelete.addEventListener('click', async () => {
      const { id } = this.form.dataset;
      await this.todoService.delete(id);
      await this.changeAction('list');
    });

    this.form.addEventListener('submit', async (event) => {
      const formData = new FormData(this.form);
      const formDataEntries = Object.fromEntries(formData);
      const todo = new Todo(formDataEntries.title, formDataEntries.description, formDataEntries.dueDate, formDataEntries.importance, formDataEntries.done);
      const { id } = this.form.dataset;

      if (id === '') {
        // create a new todo and update the form with the created id
        const newTodo = await this.todoService.create(todo);
        this.updateForm(newTodo);
      } else {
        // update the todo based on the id
        await this.todoService.update(id, todo);
      }

      switch (event.submitter.id) {
        case 'app-form-action-saveAndClose':
          this.clearForm();
          await this.changeAction('list');
          break;
        default:
      }
    });

    this.appListItemsContainer.addEventListener('click', async (event) => {
      const { id } = event.target.dataset;
      const { action } = event.target.dataset;
      if (id && action) {
        const todo = await this.todoService.get(id);
        switch (action) {
          case 'done':
            todo.done = !todo.done;
            this.todoService.update(id, todo);
            this.todos = await this.todoService.getAll();
            this.render();
            break;
          case 'edit':
            this.updateForm(todo);
            this.changeAction('form');
            break;
          default:
          // do nothing
        }
      }
    });

    this.buttonsSortBy.forEach((element) => {
      element.addEventListener('click', (event) => {
        this.resetSortBy(); // reset all buttons state
        const button = event.target;
        const buttonSortBy = button.dataset.sortBy || this.sortBy;
        if (this.sortBy === buttonSortBy) {
          this.sortBy = button.dataset.sortBy;
          this.sortDirection = this.sortDirection === 'up' ? 'down' : 'up'; // invert the direction
        } else {
          this.sortBy = button.dataset.sortBy;
          this.sortDirection = 'up'; // start sorting is up
        }
        button.dataset.sortDirection = this.sortDirection;
        this.todoService.sortBy(this.todos, this.sortBy, this.sortDirection);
        this.render();
      });
    });

    this.buttonFilterDone.addEventListener('click', () => {
      this.filterDone = this.filterDone === 'yes' ? 'no' : 'yes';
      this.filterDoneState = this.filterDoneState === 'active' ? 'inactive' : 'active';
      this.appListItemsContainer.dataset.filterDone = this.filterDone;
      this.buttonFilterDone.dataset.filterDoneState = this.filterDoneState;
    });

    this.buttonFilterOverdue.addEventListener('click', () => {
      this.filterOverdue = this.filterOverdue === 'yes' ? 'no' : 'yes';
      this.filterOverdueState = this.filterOverdueState === 'active' ? 'inactive' : 'active';
      this.appListItemsContainer.dataset.filterOverdue = this.filterOverdue;
      this.buttonFilterOverdue.dataset.filterOverdueState = this.filterOverdueState;
    });
  }

  initDefaultFilterStates() {
    this.appListItemsContainer.dataset.filterDone = this.filterDone;
    this.appListItemsContainer.dataset.filterOverdue = this.filterOverdue;
    this.buttonFilterDone.dataset.filterDoneState = this.filterDoneState;
    this.buttonFilterOverdue.dataset.filterOverdueState = this.filterOverdueState;
  }

  initDefaultSortBy() {
    this.buttonSortByDefault.dataset.sortDirection = this.sortDirection;
    this.todoService.sortBy(this.todos, this.sortBy, this.sortDirection);
  }

  resetSortBy() {
    this.buttonsSortBy.forEach((element) => {
      const button = element;
      button.dataset.sortDirection = '';
    });
  }

  async changeAction(action) {
    switch (action) {
      case 'list':
        this.todos = await this.todoService.getAll();
        this.render();
        break;
      default:
    }
    this.appContainer.dataset.action = action;
  }

  updateForm(item) {
    const todo = new Todo(item.title, item.description, item.dueDate, item.importance, item.done, item.createDate, item._id);
    this.buttonDelete.style.display = '';
    this.form.dataset.id = todo.id;
    this.form.querySelector('input#form-title').value = todo.title;
    this.form.querySelector('textarea#form-description').innerHTML = todo.description;
    this.form.querySelector('select#form-importance').value = todo.importance;
    if (todo.dueDate !== null) this.form.querySelector('input#form-dueDate').value = todo.dueDateAsValue();
    this.form.querySelector('input#form-done').checked = todo.done;
  }

  clearForm() {
    this.buttonDelete.style.display = 'none';
    this.form.dataset.id = '';
    this.form.reset();
    this.form.querySelector('textarea#form-description').innerHTML = '';
  }

  compileTodoTemplate(todo) {
    return todoView(todo);
  }

  render() {
    if (this.todos.length) {
      let html = '';
      this.todos.forEach((item) => {
        const todo = new Todo(item.title, item.description, item.dueDate, item.importance, item.done, item.createDate, item._id);
        html += this.compileTodoTemplate(todo);
      });

      this.appListItemsContainer.innerHTML = html;
    }
  }

  async init() {
    this.todos = await this.todoService.getAll();
    this.initDefaultSortBy();
    this.initDefaultFilterStates();
    this.initEventHandlers();
    this.render();
  }
}

new TodoController().init();
