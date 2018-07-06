'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MIN_IMG_SIZE = 25;
  var MAX_IMG_SIZE = 100;
  var STEP_IMG_SIZE = 25;
  var VALIDATE_ERROR_RESPONSE = {
    MAX_COUNT: 'Слишком много хештегов, максимум 5',
    INVALID_FIRST_SYMBOL: 'Хэштеги должны начинаться с #',
    MIN_LENGTH: 'Хэштеги не могут состоять из одной #',
    MAX_LENGTH: 'Хэштеги не могут быть длиннее 20 символов (вместе с решеткой)',
    SIMILAR: 'Хэштеги не могут быть одинаковыми'
  };

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
    resizeValue.value = MAX_IMG_SIZE + '%';
    uploadScale.classList.add('hidden');
    effectsList.querySelector('#effect-none').checked = true;
    removeAllEffects();
  };
  var closeUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', uploadOverlayEscPressHandler);
    uploadFileInput.value = '';
    uploadImgPreview.style.transform = '';
  };
  var resizeImg = function (step) {
    var sizeValue = +resizeValue.value.slice(0, -1) + step;
    sizeValue = (sizeValue > MAX_IMG_SIZE) ? MAX_IMG_SIZE : sizeValue;
    sizeValue = (sizeValue < MIN_IMG_SIZE) ? MIN_IMG_SIZE : sizeValue;
    resizeValue.value = sizeValue + '%';
    uploadImgPreview.style.transform = 'scale(' + sizeValue / 100 + ')';
  };
  uploadFileInput.addEventListener('change', function () {
    var file = uploadFileInput.files[0];
    var img = uploadImgPreview.querySelector('img');
    var effectsImg = effectsList.querySelectorAll('.effects__preview');

    if (FILE_TYPES.some(function (x) {
      return file.name.toLowerCase().endsWith(x);
    })) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        img.src = reader.result;
        effectsImg.forEach(function (x) {
          x.style.backgroundImage = 'url(' + reader.result + ')';
        });
        openUploadOverlay();
      });

      reader.readAsDataURL(file);
    }
  });
  uploadOverlayCancel.addEventListener('click', function () {
    closeUploadOverlay();
  });
  resizeValueMinus.addEventListener('click', function () {
    resizeImg(-STEP_IMG_SIZE);
  });
  resizeValuePlus.addEventListener('click', function () {
    resizeImg(STEP_IMG_SIZE);
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
      textHashtags.setCustomValidity(VALIDATE_ERROR_RESPONSE.MAX_COUNT);
    } else if (arrHashtags.some(function (x) {
      return x[0] !== '#';
    })) {
      textHashtags.setCustomValidity(VALIDATE_ERROR_RESPONSE.INVALID_FIRST_SYMBOL);
    } else if (arrHashtags.some(function (x) {
      return x.length === 1;
    })) {
      textHashtags.setCustomValidity(VALIDATE_ERROR_RESPONSE.MIN_LENGTH);
    } else if (arrHashtags.some(function (x) {
      return x.length > 20;
    })) {
      textHashtags.setCustomValidity(VALIDATE_ERROR_RESPONSE.MAX_LENGTH);
    } else if (getUniqueArray(arrHashtags).length !== arrHashtags.length) {
      textHashtags.setCustomValidity(VALIDATE_ERROR_RESPONSE.SIMILAR);
    } else {
      textHashtags.setCustomValidity('');
    }
  };

  textHashtags.addEventListener('input', function () {
    validateHashtags();
  });

  var submitForm = function () {
    closeUploadOverlay();
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(uploadForm), submitForm, window.utils.errorHandler);
  });
})();
