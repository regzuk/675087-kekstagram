'use strict';

(function () {
  var uploadImgPreview = document.uploadOverlay.querySelector('.img-upload__preview');
  var uploadScale = document.uploadOverlay.querySelector('.img-upload__scale');
  var scaleLine = uploadScale.querySelector('.scale__line');
  var scaleValue = uploadScale.querySelector('.scale__value');
  var scalePin = scaleLine.querySelector('.scale__pin');
  var scaleLevel = scaleLine.querySelector('.scale__level');
  var effectsList = document.uploadOverlay.querySelector('.img-upload__effects');

  scalePin.addEventListener('mousedown', function (evt) {
    var coord = evt.clientX;

    var effectType = effectsList.querySelector('.effects__radio:checked').value;

    var changeEffectValue = function (value, effect) {
      var filter = '';
      switch (effect) {
        case 'chrome':
          filter = 'grayscale(' + value / 100 + ')';
          break;
        case 'sepia':
          filter = 'sepia(' + value / 100 + ')';
          break;
        case 'marvin':
          filter = 'invert(' + value + '%)';
          break;
        case 'phobos':
          filter = 'blur(' + value / 100 * 3 + 'px)';
          break;
        case 'heat':
          filter = 'brightness(' + (1 + value / 100 * 2) + ')';
          break;
      }
      uploadImgPreview.style.filter = filter;
    };

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
      scalePin.style.left = newPos + 'px';
      scaleLevel.style.width = newPos + 'px';
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

})();
