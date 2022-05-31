import { todoService } from "../services/todo-service.js";
import Utils from "../utils.js";

// TODO: build filters and sortings
// TODO: build the done function on the list view (maybe with a dialog?)
// TODO: (optional) make a delete function

export default class TodoController {

    constructor() {
        
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

    }

    initEventHandlers() {

        // set the min date for the due date input 
        this.inputDueDate.addEventListener('click', (event) => {
            event.target.setAttribute('min', Utils.getDateTodayAsValue());
        });
        
        this.buttonSwitchTheme.addEventListener('click', () => {
            this.body.classList.toggle('dark');
        });

        this.buttonForm.addEventListener('click', () => {
            this.clearForm();
            this.changeAction('form');
        });

        this.buttonList.addEventListener('click', () => {
            this.changeAction('list');
        });

        this.form.addEventListener('submit', (event) => {
            const todoFormData = new FormData(this.form);
            const todoObject = Object.fromEntries(todoFormData);
            const {todoId} = this.form.dataset;

            if (todoId === '') {
                // create a new todo and update the form with the created id
                const newTodo = todoService.add(todoObject);
                this.updateForm(newTodo);
            } else {
                // update the todo based on the todo id
                todoService.update(todoId, todoObject);
            }

            switch (event.submitter.id) {
                case 'app-form-action-saveAndClose':
                    this.clearForm();
                    this.render();
                    this.changeAction('list');
                    break;
                default:
                    this.render(); // make sure the list view is updated with the changes
            }

        });

        this.appListItemsContainer.addEventListener('click', (event) => {

            const {todoEdit: editId} = event.target.dataset;
            const {todoDone: doneId} = event.target.dataset;

            if (editId !== undefined) {
                const todo = todoService.get(editId);
                this.updateForm(todo);
                this.changeAction('form');
            }

            if (doneId !== undefined) {
                // TODO: make the item done, when clicked here
                console.log('done');
            }


        });
    }

    changeAction(action) {
        this.appContainer.dataset.action = action;
    }

    updateForm(todo) {
        this.form.dataset.todoId = todo.id;
        this.form.querySelector('input#form-title').value = todo.title;
        this.form.querySelector('textarea#form-description').innerHTML = todo.description;
        this.form.querySelector('select#form-importance').value = todo.importance;
        this.form.querySelector('input#form-dueDate').value = todo.dueDateAsValue();
        this.form.querySelector('input#form-done').checked = todo.done;
    }

    clearForm() {
        this.form.reset();
    }

    // eslint-disable-next-line class-methods-use-this
    compileTodoTemplate(todo) {
        return `
            <li class="item">
                <h3>${todo.title} (${todo.createDate})</h3>
                <p>${todo.description}</p>
                <span class="item-importance"><span class="icon icon-importance-${todo.importance}"></span></span>
                <span class="item-dueDate">${todo.dueDateHr()}</span>
                <button class="item-edit icon icon-edit" data-todo-edit="${todo.id}"></button>
                <button class="item-done icon icon-done" data-todo-done="${todo.id}"></button>
            </li>
        `;
    }

    renderTodos(todos) {
        let html = '';
        todos.forEach(todo => {
            html += this.compileTodoTemplate(todo);
        });
        return html;
    }

    render() {
        this.appListItemsContainer.innerHTML = this.renderTodos(todoService.todos);
    }

    init() {
        todoService.load();
        this.initEventHandlers();
        this.render();
    }

}

new TodoController().init();