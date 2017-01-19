// <data-boo> generic container
CustomTag({
  name: 'data-boo',
  onInit() {
    const init = el => {
      // grab the class
      const Class = customElements.get(el.dataset.boo);
      // create the Custom Element
      const ce = new Class();
      // create a placeholder
      const ph = el.ownerDocument.createElement('unknown');
      // swap current node with the placeholder
      el.replaceWith(ph);
      // add current node to Custom Element
      ce.appendChild(el);
      // drop the placeholder with Custom Element
      ph.replaceWith(ce);
      // ... profit!
    };
    // any element with a data-boo attribute !!!
    this.querySelectorAll('[data-boo]').forEach(el => {
      // grab custom element name
      const name = el.dataset.boo;
      // setup initialization
      // as soon as its class is defined
      customElements
        .whenDefined(name)
        .then(() => init(el));
    });
  }
});



// <vali-dator> form example
CustomTag({
  name: 'vali-dator',
  onInit() {
    this.firstElementChild
      .addEventListener('submit', this.authorize);
  },
  authorize(evt) {
    const self = evt.target.closest('vali-dator');
    const err = self.validate(evt);
    if (err) {
      evt.preventDefault();
      alert(err);
    }
  },
  validate(evt) {
    // for demo purpose
    return new Error('Invalid Date');
  }
});