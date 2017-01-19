var stats;
if (window.performance && performance.memory) {
  stats = new MemoryStats();
  stats.domElement.style.position = 'fixed';
  stats.domElement.style.right = '0px';
  stats.domElement.style.bottom = '0px';
  document.body.appendChild( stats.domElement );
} else {
  stats = {update: function () {}};
}

if (typeof fetch === 'undefined') {
  window.fetch = function (url) {
    var resolve, xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
      resolve({
        text: function () {
          return xhr.responseText;
        },
        json: function () {
          return JSON.parse(xhr.responseText);
        }
      });
    };
    xhr.send();
    return new Promise(function (res) {
      resolve = res;
    });
  };
}

CustomTag({
  name: 'db-monster',
  watch: ['data'],
  onConnect() {
    if (this.root) {
      const update = () => {
        this.raf = requestAnimationFrame(update);
        getData().forEach((info, i) => {
          this.updates[i](info);
        });
        stats.update();
      };
      update();
    }
  },
  onDisconnect() {
    if (this.raf) {
      clearRequestAnimationFrame(this.raf);
      this.raf = 0;
    }
  },
  onChange(data, prev, curr) {
    fetch(curr)
      .then(body => body.text())
      .then(text => {
        const script = this.ownerDocument.createElement('script');
        script.textContent = text;
        this.prepend(script);
        script.remove();
      })
      .then(() => this.createTable())
  },
  createTable() {
    function append(where, what) {
      return where.appendChild(
        (where.ownerDocument || document).createElement(what)
      );
    }
    const doc = this.ownerDocument;
    this.innerHTML = '';
    let rootNode = append(this, 'table');
    rootNode.classList.add('table', 'table-striped', 'latest-data');
    rootNode = append(rootNode, 'tbody');
    this.root = rootNode;
    this.updates = getData().map(
      function (db) {
        let
          tr = append(rootNode, 'tr'),
          dbName = append(tr, 'td'),
          queryCount = append(tr, 'td'),
          countInfo = append(queryCount, 'span'),
          topFiveQueries = db.topFiveQueries.map(this, tr),
          infoName = ''
        ;
        dbName.className = 'dbname';
        queryCount.className = 'query-count';
        return function (db) {
          if (infoName !== db.name) {
            infoName = db.name;
            tr.setAttribute('key', infoName);
            dbName.textContent = infoName;
          }
          countInfo.textContent = db.queries.length;
          countInfo.className = getCountClassName(db);
          db.topFiveQueries.forEach((info, i) => {
            topFiveQueries[i](info);
          });
        };
      },
      function (query) {
        let
          td = append(this, 'td'),
          elapsed = append(td, 'span'),
          popoverLeft = append(td, 'div'),
          popoverContent = append(popoverLeft, 'div'),
          arrow = append(popoverLeft, 'div')
        ;
        elapsed.className = 'foo';
        popoverLeft.className = 'popover left';
        popoverContent.className = 'popover-content';
        arrow.className = 'arrow';
        return function (query) {
          popoverContent.textContent = query.query;
          elapsed.textContent = formatElapsed(query.elapsed);
          td.className = 'Query ' + elapsedClassName(query.elapsed);
        };
      }
    );
    this.onConnect();
  }
});