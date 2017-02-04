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
const TodoItem = CustomTag(
  withTemplate({
    name: 'todo-item',
    watch: ['index'],
    onInit() {
      this.querySelector('input').addEventListener('click', () =>
        store(store().filter((todo, index) => index != this.index)));
    },
    get template() {return `
      <label>
        <input type=checkbox>
        <slot></slot>
      </label>
    `;}
  })
);

// <todo-list>
const TodoList = CustomTag(
  withTemplate({
    name: 'todo-list',
    get template() {return `
      <ul>
        ${store().map((todo, index) => `
          <li>
            <todo-item index=${index}>
              ${todo}
            </todo-item>
          </li>
        `).join("")}
      </ul>
    `;},
  })
);

store(['Buy milk', 'Call Sarah', 'Pay bills']);

// decorators
function withTemplate(definition) {
  const onInit = definition.onInit;
  definition.onInit = function () {
    const html = this.innerHTML;
    this.innerHTML = this.template;
    const slot = this.querySelector('slot');
    if (slot && !slot.hasAttribute('template')) {
      slot.setAttribute('template', this.tagName);
      slot.innerHTML = html;
    }
    if (onInit) onInit.call(this);
  };
  return definition;
}