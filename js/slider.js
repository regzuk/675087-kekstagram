'use strict';

(function () {
  var EFFECTS_NAME = {
    CHROME: 'chrome',
    SEPIA: 'sepia',
    MARVIN: 'marvin',
    PHOBOS: 'phobos',
    HEAT: 'heat'
  };
  var SCALE_MIN = 0;
  var SCALE_MAX = 100;
  var SCALE_STEP = 5;

  var uploadImgPreview = window.uploadOverlay.querySelector('.img-upload__preview');
  var uploadScale = window.uploadOverlay.querySelector('.img-upload__scale');
  var scaleLine = uploadScale.querySelector('.scale__line');
  var scaleValue = uploadScale.querySelector('.scale__value');
  var scalePin = scaleLine.querySelector('.scale__pin');
  var scaleLevel = scaleLine.querySelector('.scale__level');
  var effectsList = window.uploadOverlay.querySelector('.img-upload__effects');

  var changeEffectValue = function (value, effect) {
    var filter = '';
    switch (effect) {
      case EFFECTS_NAME.CHROME:
        filter = 'grayscale(' + value / 100 + ')';
        break;
      case EFFECTS_NAME.SEPIA:
        filter = 'sepia(' + value / 100 + ')';
        break;
      case EFFECTS_NAME.MARVIN:
        filter = 'invert(' + value + '%)';
        break;
      case EFFECTS_NAME.PHOBOS:
        filter = 'blur(' + value / 100 * 3 + 'px)';
        break;
      case EFFECTS_NAME.HEAT:
        filter = 'brightness(' + (1 + value / 100 * 2) + ')';
        break;
    }
    uploadImgPreview.style.filter = filter;
  };

  var movePin = function (newPos) {
    scalePin.style.left = newPos + 'px';
    scaleLevel.style.width = newPos + 'px';
  };

  var getEffectType = function () {
    return effectsList.querySelector('.effects__radio:checked').value;
  };

  scalePin.addEventListener('mousedown', function (evt) {
    var coord = evt.clientX;

    var effectType = getEffectType();

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = moveEvt.clientX - coord;

      coord = moveEvt.clientX;
      var newPos = scalePin.offsetLeft + shift;
      if (newPos > scaleLine.offsetWidth) {
        newPos = scaleLine.offsetWidth;
      } else if (newPos < 0) {
        newPos = 0;
      }
      movePin(newPos);
      scaleValue.value = Math.round(scalePin.offsetLeft / scaleLine.offsetWidth * 100);
      changeEffectValue(scaleValue.value, effectType);
    };

    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  document.addEventListener('keydown', function (evt) {
    if (evt.target === scalePin) {
      if (window.utils.isEnterLeft(evt)) {
        scaleValue.value = Math.max(scaleValue.value - SCALE_STEP, SCALE_MIN);
      } else if (window.utils.isEnterRight(evt)) {
        scaleValue.value = Math.min(+scaleValue.value + SCALE_STEP, SCALE_MAX);
      }
      var newPos = Math.round(scaleValue.value * scaleLine.offsetWidth / 100);
      movePin(newPos);
      changeEffectValue(scaleValue.value, getEffectType());
    }
  });

})();
