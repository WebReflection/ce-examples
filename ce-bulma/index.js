const BulmaTile = CustomTag({
  // the custom element name
  name: 'bulma-tile',

  // reacting to these changes
  watch: ['size', 'vertical'],

  // setup event listeners once
  onInit() { this.addEventListener('update', this); },
  handleEvent(e) { this[e.type](e); },

  // update once connected and
  // and once size or vertical attributes change
  onConnect() { this.update(); },
  onChange() { this.update(); },
  update() {
    // list of new classes to add
    const classes = ['tile'];

    // if there was a mutation observer, drop it
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // if the parent is a tile too ...
    if (this.parentNode.nodeName === this.nodeName) {
      // verify this first element child
      let child = this.firstElementChild;
      // if its not another tile ...
      if (child && child.nodeName !== this.nodeName) {
        // flag this tile as parent
        classes.push('is-parent');
        // also flag its children as such
        [].forEach.call(
          this.children,
          child => child.classList.add('tile', 'is-child')
        );
      }
    } else {
      // flag this tile as ancestor
      classes.push('is-ancestor');
      // add the mutation observer listener
      this.observer = new MutationObserver(records => {
        let update = false;
        records.forEach(record => {
          // only tiles matter
          if (record.target.nodeName === this.nodeName) {
            update = true;
            // clean up removed nodes tile classes
            record.removedNodes.forEach(target => {
              if (target.nodeType === 1)
                this.dropClasses.call(target);
            });
          }
        });
        // only if needed
        if (update) {
          // trigger an update for all other nodes
          const evt = new CustomEvent('update');
          this.querySelectorAll(this.nodeName)
            .forEach(tile => tile.dispatchEvent(evt));
        }
      });
      this.observer.observe(this, {
        childList: true,
        subtree: true
      });
    }

    // add size if specified as attribute
    if (this.size) classes.push('is-' + this.size);

    // add vertical if the attribute is just present
    if (this.hasAttribute('vertical'))
      classes.push('is-vertical');

    // cleanup classes and apply new one
    this.dropClasses();
    this.classList.add(...classes);
  },

  dropClasses() {
    this.classList.remove(
      'tile',
      'is-ancestor',
      'is-parent',
      'is-child',
      'is-1', 'is-2', 'is-3',
      'is-4', 'is-5', 'is-6',
      'is-7', 'is-8', 'is-9',
      'is-10', 'is-11', 'is-12' 
    );
  }
});