const actions = document.querySelector('div#app-actions');
const createDialog = document.querySelector('div#app-createDialog');
const todos = document.querySelector('div#app-todos');

function toggleVisibilty(element) {
    if (element.classList.contains('show')) {
        element.classList.add('hide')
        element.classList.remove('show');
    } else {
        element.classList.add('show')
        element.classList.remove('hide');
    }
}

// button: theme switcher
document.querySelector('button#app-actions-switchTheme').addEventListener('click', () => {
    const body = document.querySelector('body');
    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
    } else {
        body.classList.add('dark')
    }
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