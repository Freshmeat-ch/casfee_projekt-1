export function todoView(todo) {
  return `
        <li class="item" data-state="${todo.state()}" data-create-date="${todo.createDateAsTimestamp()}" data-due-date="${todo.dueDateAsTimestamp()}">
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            <span class="item-importance"><span class="icon icon-importance-${todo.importance}"></span></span>
            <span class="item-dueDate">${todo.dueDateAsText()}</span>
            <button class="item-edit" data-todo-id="${todo.id}" data-action="edit" title="Diese Todo bearbeiten"></button>
            <button class="item-done" data-todo-id="${todo.id}" data-action="done" title="Diese Todo als erledigt/offen markieren"></button>
        </li>
    `;
}
