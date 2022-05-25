const app = document.querySelector('div#app');
const appActions = document.querySelector('div#app-actions');
const appCreateDialog = document.querySelector('div#app-createDialog');
const appCreateDialogForm = document.querySelector('form#app-createDialog-form');
const appTodos = document.querySelector('div#app-todos');
const appTodosItems = document.querySelector('div#app-todos-items');
const storage = localStorage;

function changeAction(action) {
    app.dataset.action = action;
}

function updateId(id) {
    appCreateDialogForm.querySelector('input[name=id]').value = id;
}

function clearForm() {
    updateId('');
    appCreateDialogForm.reset();
}

function createId() {
  function randomChars(){
    return Math.random().toString(16).slice(-4);
  }
  return `${randomChars() + randomChars() + randomChars() }`;
}

function upsertTask(data) {

    const task = data;
    let todos = JSON.parse(storage.getItem('todos'));
    let updateKey = null;

    if (todos === null) todos = [];
    if (task.id.length === 0) {
        const id = createId();
        updateId(id);
        task.id = id;
    }

    todos.forEach((storedTask, key) => {
        if (storedTask.id === task.id) {
            updateKey = key;
        }
    });

    if (updateKey === null) {
        todos.push(task);
    } else {
        todos[updateKey] = task;
    }

    storage.setItem('todos', JSON.stringify(todos));

}

function renderTasks() {

    let html = `<ol>`;
    const todos = JSON.parse(storage.getItem('todos'));

    todos.forEach((task) => {
        html += `<li class="item">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <span class="item-importance"><span class="icon icon-importance-${task.importance}"></span></span>
            <span class="item-dueDate">${task.dueDate}</span>
            <button class="item-edit"><i class="fa-solid fa-pen"></i></button>
            <button class="item-done"><i class="fa-solid fa-check"></i></button>
        `;
    });
    
    html += `</ol>`;
    appTodosItems.innerHTML = html;

}

// button: theme switcher
document.querySelector('button#app-actions-switchTheme').addEventListener('click', () => {
    document.querySelector('body').classList.toggle('dark');
});

// button: create new
document.querySelector('button#app-actions-createNew').addEventListener('click', () => {
    changeAction('createNew');
});

// button: overview
document.querySelector('button#app-createDialog-action-overview').addEventListener('click', () => {
    changeAction('list');
});

// form submit
appCreateDialogForm.addEventListener('submit', (event) => {
    let task = new FormData(event.target);
        task = Object.fromEntries(task);
    switch (event.submitter.id) {
        case 'app-createDialog-action-saveAndClose':
            upsertTask(task)
            clearForm();
            changeAction('list');
            renderTasks();
            break;
        default:
            upsertTask(task);
            renderTasks();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});
