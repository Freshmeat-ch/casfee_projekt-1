import { TodoService } from '../services/todo-service.js';
import { SettingsService } from '../services/settings-service.js';
import { Todo } from '../services/todo.js';
import { emptyView } from '../views/empty-view.js';
import { todoView } from '../views/todo-view.js';

export default class TodoController {
  constructor() {
    // todos
    this.todoService = new TodoService();
    this.todos = [];

    // settings
    this.settingsService = new SettingsService();
    this.settingTheme = this.settingsService.getTheme() || 'light';

    // sortings & filters defaults
    this.sortBy = this.settingsService.getSorting() ? this.settingsService.getSorting().sortBy : 'dueDate';
    this.sortDirection = this.settingsService.getSorting() ? this.settingsService.getSorting().sortDirection : 'up';
    this.filterDone = this.settingsService.getFilterDone() ? this.settingsService.getFilterDone().filterDone : 'no';
    this.filterDoneState = this.settingsService.getFilterDone() ? this.settingsService.getFilterDone().filterDoneState : 'inactive';
    this.filterOverdue = this.settingsService.getFilterOverdue() ? this.settingsService.getFilterOverdue().filterOverdue : 'no';
    this.filterOverdueState = this.settingsService.getFilterOverdue() ? this.settingsService.getFilterOverdue().filterOverdueState : 'inactive';

    // containers
    this.body = document.querySelector('body');
    this.appContainer = document.querySelector('div#app');
    this.appListControls = document.querySelector('div#app-list-controls');
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
    this.buttonSave = document.querySelector('button[id=app-form-action-save]');
    this.buttonSaveAndClose = document.querySelector('button[id=app-form-action-saveAndClose]');

    // buttons: all
    this.buttonsSortBy = document.querySelectorAll('button[id^=sortBy]');
  }

  initEventHandlers() {
    this.buttonSwitchTheme.addEventListener('click', () => {
      this.settingTheme = this.settingTheme === 'dark' ? 'light' : 'dark';
      this.settingsService.setTheme(this.settingTheme);
      this.switchTheme();
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
      if (window.confirm('Möchten Sie dieses Todo wirklich löschen?')) {
        const { id } = this.form.dataset;
        await this.todoService.delete(id);
        await this.changeAction('list');
      }
    });

    this.form.addEventListener('submit', async (event) => {
      const formData = new FormData(this.form);
      const formDataEntries = Object.fromEntries(formData);
      // eslint-disable-next-line no-unneeded-ternary
      const todoDone = formDataEntries.done === 'true' ? true : false;
      const todo = new Todo(formDataEntries.title, formDataEntries.description, formDataEntries.dueDate, formDataEntries.importance, todoDone);
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
        this.settingsService.setSorting(this.sortBy, this.sortDirection);
        this.render();
      });
    });

    this.buttonFilterDone.addEventListener('click', () => {
      this.filterDone = this.filterDone === 'yes' ? 'no' : 'yes';
      this.filterDoneState = this.filterDoneState === 'active' ? 'inactive' : 'active';
      this.appListItemsContainer.dataset.filterDone = this.filterDone;
      this.buttonFilterDone.dataset.filterDoneState = this.filterDoneState;
      this.settingsService.setFilterDone(this.filterDone, this.filterDoneState);
    });

    this.buttonFilterOverdue.addEventListener('click', () => {
      this.filterOverdue = this.filterOverdue === 'yes' ? 'no' : 'yes';
      this.filterOverdueState = this.filterOverdueState === 'active' ? 'inactive' : 'active';
      this.appListItemsContainer.dataset.filterOverdue = this.filterOverdue;
      this.buttonFilterOverdue.dataset.filterOverdueState = this.filterOverdueState;
      this.settingsService.setFilterOverdue(this.filterOverdue, this.filterOverdueState);
    });
  }

  initTheme() {
    this.switchTheme();
  }

  initDefaultSortBy() {
    this.buttonSortByDefault.dataset.sortDirection = this.sortDirection;
  }

  initDefaultFilterStates() {
    this.appListItemsContainer.dataset.filterDone = this.filterDone;
    this.appListItemsContainer.dataset.filterOverdue = this.filterOverdue;
    this.buttonFilterDone.dataset.filterDoneState = this.filterDoneState;
    this.buttonFilterOverdue.dataset.filterOverdueState = this.filterOverdueState;
  }

  switchTheme() {
    this.body.className = '';
    this.body.classList.add(this.settingTheme);
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
    this.buttonSave.innerHTML = 'Speichern';
    this.buttonSaveAndClose.innerHTML = 'Speichern &amp; Schliessen';
    this.buttonDelete.classList.remove('hide');
    this.form.dataset.id = todo.id;
    this.form.querySelector('input#form-title').value = todo.title;
    this.form.querySelector('textarea#form-description').innerHTML = todo.description;
    this.form.querySelector('select#form-importance').value = todo.importance;
    if (todo.dueDate !== null) this.form.querySelector('input#form-dueDate').value = todo.dueDateAsValue();
    this.form.querySelector('input#form-done').checked = todo.done;
  }

  clearForm() {
    this.buttonDelete.classList.add('hide');
    this.buttonSave.innerHTML = 'Erstellen';
    this.buttonSaveAndClose.innerHTML = 'Erstellen &amp; Schliessen';
    this.form.dataset.id = '';
    this.form.reset();
    this.form.querySelector('textarea#form-description').innerHTML = '';
  }

  compileTodoTemplate(todo) {
    return todoView(todo);
  }

  compileEmptyTemplate() {
    return emptyView();
  }

  render() {
    let html = '';
    if (this.todos.length) {
      this.todoService.sortBy(this.todos, this.sortBy, this.sortDirection);
      this.appListControls.classList.remove('hide');
      this.todos.forEach((item) => {
        const todo = new Todo(item.title, item.description, item.dueDate, item.importance, item.done, item.createDate, item._id);
        html += this.compileTodoTemplate(todo);
      });
    } else {
      this.appListControls.classList.add('hide');
      html += this.compileEmptyTemplate();
    }
    this.appListItemsContainer.innerHTML = html;
  }

  async init() {
    this.todos = await this.todoService.getAll();
    this.initTheme();
    this.initDefaultSortBy();
    this.initDefaultFilterStates();
    this.initEventHandlers();
    this.render();
  }
}

new TodoController().init();
