'use strict';

(function () {
  var uploadFileInput = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadForm = document.querySelector('#upload-select-image');
  var uploadOverlayCancel = uploadOverlay.querySelector('#upload-cancel');
  var resizeValue = uploadOverlay.querySelector('.resize__control--value');
  var resizeValueMinus = uploadOverlay.querySelector('.resize__control--minus');
  var resizeValuePlus = uploadOverlay.querySelector('.resize__control--plus');
  var uploadImgPreview = uploadOverlay.querySelector('.img-upload__preview');
  var uploadScale = uploadOverlay.querySelector('.img-upload__scale');
  var scaleLine = uploadScale.querySelector('.scale__line');
  var scaleValue = uploadScale.querySelector('.scale__value');
  var scalePin = scaleLine.querySelector('.scale__pin');
  var scaleLevel = scaleLine.querySelector('.scale__level');
  var effectsList = uploadOverlay.querySelector('.img-upload__effects');
  var uploadText = uploadOverlay.querySelector('.img-upload__text');
  var textHashtags = uploadText.querySelector('.text__hashtags');

  window.uploadOverlay = uploadOverlay;

  var removeAllEffects = function () {
    uploadImgPreview.className = 'img-upload__preview';
    uploadImgPreview.style.filter = '';
  };

  var uploadOverlayEscPressHandler = function (evt) {
    var textDescription = uploadText.querySelector('.text__description');
    if (window.utils.isEnterEsc(evt) && evt.target !== textHashtags && evt.target !== textDescription) {
      closeUploadOverlay();
    }
  };
  var openUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', uploadOverlayEscPressHandler);
    resizeValue.value = '100%';
    uploadScale.classList.add('hidden');
    effectsList.querySelector('#effect-none').checked = true;
    removeAllEffects();
  };
  var closeUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', uploadOverlayEscPressHandler);
    uploadFileInput.value = '';
  };
  var resizeImg = function (step) {
    var sizeValue = +resizeValue.value.slice(0, -1) + step;
    sizeValue = (sizeValue > 100) ? 100 : sizeValue;
    sizeValue = (sizeValue < 25) ? 25 : sizeValue;
    resizeValue.value = sizeValue + '%';
    uploadImgPreview.style.transform = 'scale(' + sizeValue / 100 + ')';
  };
  uploadFileInput.addEventListener('change', function () {
    openUploadOverlay();
  });
  uploadOverlayCancel.addEventListener('click', function () {
    closeUploadOverlay();
  });
  resizeValueMinus.addEventListener('click', function () {
    resizeImg(-25);
  });
  resizeValuePlus.addEventListener('click', function () {
    resizeImg(25);
  });

  var applyEffect = function (effectName) {
    removeAllEffects();
    uploadImgPreview.classList.add('effects__preview--' + effectName);
    if (effectName === 'none') {
      uploadScale.classList.add('hidden');
    } else {
      uploadScale.classList.remove('hidden');
      scalePin.style.left = scaleLine.offsetWidth + 'px';
      scaleLevel.style.width = scaleLine.offsetWidth + 'px';
      scaleValue.value = 100;
    }
  };

  effectsList.addEventListener('click', function (evt) {
    var path = evt.path || (evt.composedPath && evt.composedPath());
    var effectItem;
    var effect;
    for (var i = 0; i < path.length; i++) {
      if (path[i].classList.contains('effects__item')) {
        effectItem = path[i];
        break;
      }
    }
    effect = effectItem.querySelector('.effects__radio').value;
    applyEffect(effect);
  });

  var getUniqueArray = function (arr) {
    var obj = {};
    arr.forEach(function (x) {
      obj[x] = true;
    });

    return Object.keys(obj);
  };

  var validateHashtags = function () {
    var arrHashtags = textHashtags.value.toLowerCase().split(' ').filter(function (x) {
      return x.length > 0;
    });
    if (arrHashtags.length > 5) {
      textHashtags.setCustomValidity('Слишком много хештегов, максимум 5');
    } else if (arrHashtags.some(function (x) {
      return x[0] !== '#';
    })) {
      textHashtags.setCustomValidity('Хэштеги должны начинаться с #');
    } else if (arrHashtags.some(function (x) {
      return x.length === 1;
    })) {
      textHashtags.setCustomValidity('Хэштеги не могут состоять из одной #');
    } else if (arrHashtags.some(function (x) {
      return x.length > 20;
    })) {
      textHashtags.setCustomValidity('Хэштеги не могут быть длиннее 20 символов (вместе с решеткой)');
    } else if (getUniqueArray(arrHashtags).length !== arrHashtags.length) {
      textHashtags.setCustomValidity('Хэштеги не могут быть одинаковыми');
    } else {
      textHashtags.setCustomValidity('');
    }
  };

  textHashtags.addEventListener('input', function () {
    validateHashtags();
  });

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
  });
})();
