const store = (() => {
  let state;
  return todos => {
    if (todos) {
      state = todos;
      render('todo-list');
    }   
    return state;
  };  
})();

const render = (component, parent = document.body) =>
  parent.innerHTML = `<${component}></${component}>`;

// <todo-item>
const TodoItem = CustomTag({
  name: 'todo-item',
  watch: ['index'],
  onChange(name, old, change) {
    this.index = change;
  },
  onInit() {
    // we can still use a semantic slot
    // recycling what's in there already
    this.innerHTML = `
      <label>
        <input type=checkbox>
        <slot>${this.innerHTML}</slot>
      </label>
    `;
    this.slot = this.querySelector('slot');
    this.querySelector('input').addEventListener('click', () =>
      store(store().filter((todo, index) => index != this.index)));
  }
});

// <todo-list>
const TodoList = CustomTag({
  name: 'todo-list',
  onInit() {
    this.innerHTML = `
      <ul>
        ${store().map((todo, index) => `
          <li>
            <todo-item index=${index}>
              ${todo}
            </todo-item>
          </li>
        `).join("")}
      </ul>
    `;
  }
});

store(['Buy milk', 'Call Sarah', 'Pay bills']);
