const actions = document.querySelector('div#app-actions');
const createDialog = document.querySelector('div#app-createDialog');
const todos = document.querySelector('div#app-todos');

function toggleVisibilty(element) {
    element.classList.toggle('hide');
}

// button: theme switcher
document.querySelector('button#app-actions-switchTheme').addEventListener('click', () => {
    document.querySelector('body').classList.toggle('dark');
});

// button: create new
document.querySelector('button#app-actions-createNew').addEventListener('click', () => {
    toggleVisibilty(actions);
    toggleVisibilty(createDialog);
    toggleVisibilty(todos);
});

// button: overview
document.querySelector('button#app-createDialog-action-overview').addEventListener('click', () => {
    toggleVisibilty(actions);
    toggleVisibilty(createDialog);
    toggleVisibilty(todos);
});
