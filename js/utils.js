'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var LEFT_KEYCODE = 37;
  var RIGHT_KEYCODE = 39;
  var DEBOUNCE_INTERVAL = 500;
  var TIMEOUT = 4000;

  window.utils = {
    isEnterEsc: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },
    isEnterLeft: function (evt) {
      return evt.keyCode === LEFT_KEYCODE;
    },
    isEnterRight: function (evt) {
      return evt.keyCode === RIGHT_KEYCODE;
    },
    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; padding: 0 50px; margin: 0 auto; text-align: center; background-color: rgba(0, 0, 0, 0.7);';
      node.style.width = '400px';
      node.style.position = 'fixed';
      node.style.left = '50%';
      node.style.top = '50%';
      node.style.transform = 'translate(-50%, -50%)';
      node.style.fontSize = '20px';

      node.textContent = errorMessage;
      document.body.querySelector('main').appendChild(node);
      setTimeout(function () {
        document.body.querySelector('main').removeChild(node);
      }, TIMEOUT);
    },
    debounce: function (func) {
      var lastTimeout;

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          func.apply(null, args);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
