var XClock = (function () {'use strict';

  function rotate(deg) { return "rotate(" + deg + "deg)"; }

  var counter = 0;

  restyle('x-clock', {
    'x-clock': {
      display: 'block',
      width: 100,
      height: 100,
      position: 'relative',
      border: '6px solid black',
      'border-radius': '50%'
    },
    '.container::after': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 12,
      height: 12,
      margin: '-6px 0 0 -6px',
      background: 'black',
      'border-radius': 6,
      content: '""',
      display: 'block'
    },
    '.container > div': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      background: 'black'
    },
    '.hour': {
      margin: '-4px 0 -4px -25%',
      padding: '4px 0 4px 25%',
      'transform-origin': '100% 50%',
      'border-radius': '4px 0 0 4px'
    },
    '.minute': {
      margin: '-40% -3px 0',
      padding: '40% 3px 0',
      'transform-origin': '50% 100%',
      'border-radius': '3px 3px 0 0'
    },
    '.second': {
      margin: '-40% -1px 0 0',
      padding: '40% 1px 0',
      'transform-origin': '50% 100%'
    }
  });

  return CustomTag({
    name: 'x-clock',
    watch: ['hour', 'minute', 'second'],
    onInit: function () {
      ++counter;
      this.className = 'number-' + counter;
      this.css = restyle('x-clock.' + this.className, {});
      this.innerHTML =
        "<div class='container'>" +
          "<div class='hour'></div>" +
          "<div class='minute'></div>" +
          "<div class='second'></div>" +
        "</div>";
      if (!this._i && !this.hour && !this.minute && !this.second) {
        this.onChange();
        this._i = setInterval(function (self) {
          self.onChange();
        }, 1000, this);
      }
    },
    onDisconnect: function () {
      clearInterval(this._i || 0);
      this._i = 0;
    },
    onChange: function(attrName, oldVal, newVal) {
      var
        now = new Date(),
        hour = this.hour || now.getHours(),
        minute = this.minute || now.getMinutes(),
        second = this.second || now.getSeconds(),
        secondAngle = second * 6,
        minuteAngle = minute * 6 + secondAngle / 60,
        hourAngle = ((hour % 12) / 12) * 360 + 90 + minute / 12
      ;
      this.css.replace({
        '.hour': {
          transform: rotate(hourAngle)
        },
        '.minute': {
          transform: rotate(minuteAngle)
        },
        '.second': {
          transform: rotate(secondAngle)
        }
      });
    }
  });

}());
