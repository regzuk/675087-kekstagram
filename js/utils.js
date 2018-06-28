'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var isEnterEsc = function (evt) {
    return evt.keyCode === ESC_KEYCODE;
  }

  document.utils = {
    isEnterEsc: isEnterEsc
  };
})();
