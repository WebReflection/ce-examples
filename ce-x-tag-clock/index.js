CustomTag({
  name: 'x-clock',
  start() {
    this.update();
    this.interval = setInterval(this.update.bind(this), 1000);
  },
  stop() {
    this.interval = clearInterval(this.interval);
  },
  update() {
    this.textContent = new Date().toLocaleTimeString();
  },
  onInit() {
    this.addEventListener('click', evt => {
      if (this.interval) this.stop();
      else this.start();
    });
  },
  onConnect() { this.start(); },
  onDisconnect() { this.stop(); }
});