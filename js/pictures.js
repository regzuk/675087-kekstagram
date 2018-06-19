'use strict';

(function () {
  var PICTURE_COUNT = 25;
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var DESCRIPTION = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];
  var MIN_COUNT_LIKES = 15;
  var MAX_COUNT_LIKES = 200;
  var MAX_COMMENT_COUNT = 2;
  var AVATAR_COUNT = 6;

  var ESC_KEYCODE = 27;

  var generatePictureOrder = function (n) {
    var arr = [];
    for (var i = 0; i < n; i++) {
      arr[i] = i + 1;
    }
    for (i = n - 1; i >= 0; i--) {
      var j = Math.floor(i * Math.random());
      var swap = arr[i];
      arr[i] = arr[j];
      arr[j] = swap;
    }
    return arr;
  };

  var getRandomArrayElement = function (arr) {
    return arr[Math.floor(arr.length * Math.random())];
  };

  var createPictureOption = function (pictureNumber) {
    var pictureUrl = 'photos/' + pictureNumber + '.jpg';
    var likeCount = Math.round(MAX_COUNT_LIKES * Math.random());
    var commentCount = Math.ceil(MAX_COMMENT_COUNT * Math.random());
    var comments = [];
    for (var i = 0; i < commentCount; i++) {
      comments[i] = getRandomArrayElement(COMMENTS);
    }

    return {
      url: pictureUrl,
      likes: (likeCount < MIN_COUNT_LIKES) ? MIN_COUNT_LIKES : likeCount,
      comments: comments,
      description: getRandomArrayElement(DESCRIPTION)
    };
  };

  var createPictureElement = function (pictureOption, pictureTemplate) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('img').src = pictureOption.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = pictureOption.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = pictureOption.comments.length;

    pictureElement.querySelector('img').addEventListener('click', function () {
      showBigPicture(pictureOption);
    });
    return pictureElement;
  };

  var createPictureList = function (pictureArray) {
    var pictureTemplate = document.querySelector('#picture').content;

    var fragment = document.createDocumentFragment();
    pictureArray.forEach(function (pictureOption) {
      fragment.appendChild(createPictureElement(pictureOption, pictureTemplate));
    });

    return fragment;
  };

  var createComment = function (textComment) {
    var comment = document.createElement('li');
    comment.classList.add('social__comment', 'social__comment--text');

    var avatar = document.createElement('img');
    avatar.classList.add('social__picture');
    avatar.src = 'img/avatar-' + Math.ceil(AVATAR_COUNT * Math.random()) + '.svg';
    avatar.alt = 'Аватар комментатора фотографии';
    avatar.width = '35';
    avatar.height = '35';

    comment.appendChild(avatar);
    comment.appendChild(document.createTextNode(textComment));

    return comment;
  };

  var removeAllComments = function (pictureComments) {
    while (pictureComments.firstChild) {
      pictureComments.removeChild(pictureComments.firstChild);
    }
  };

  var createCommnetList = function (commentArray) {
    var fragment = document.createDocumentFragment();
    commentArray.forEach(function (textComment) {
      fragment.appendChild(createComment(textComment));
    });

    return fragment;
  };

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  var showBigPicture = function (pictureOption) {
    bigPicture.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');
    document.addEventListener('keydown', bigPictureEscPressHandler);

    bigPicture.querySelector('.big-picture__img img').src = pictureOption.url;
    bigPicture.querySelector('.likes-count').textContent = pictureOption.likes;
    bigPicture.querySelector('.comments-count').textContent = pictureOption.comments.length;
    bigPicture.querySelector('.social__caption').textContent = pictureOption.description;

    var bigPictureComments = bigPicture.querySelector('.social__comments');
    removeAllComments(bigPictureComments);

    bigPictureComments.appendChild(createCommnetList(pictureOption.comments));
    bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
  };
  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
    document.removeEventListener('keydown', bigPictureEscPressHandler);
  };
  var bigPictureEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPicture();
    }
  };

  bigPictureCancel.addEventListener('click', function () {
    closeBigPicture();
  });

  var pictureArray = generatePictureOrder(PICTURE_COUNT).map(function (pictureNumber) {
    return createPictureOption(pictureNumber);
  });
  document.querySelector('.pictures').appendChild(createPictureList(pictureArray));

  var uploadFileInput = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadOverlayCancel = uploadOverlay.querySelector('#upload-cancel');
  var resizeValue = uploadOverlay.querySelector('.resize__control--value');
  var resizeValueMinus = uploadOverlay.querySelector('.resize__control--minus');
  var resizeValuePlus = uploadOverlay.querySelector('.resize__control--plus');
  var uploadImgPreview = uploadOverlay.querySelector('.img-upload__preview');
  var uploadScale = uploadOverlay.querySelector('.img-upload__scale');
  var scaleLine = uploadScale.querySelector('.scale__line');
  var scaleValue = uploadScale.querySelector('.scale__value');
  var scalePin = scaleLine.querySelector('.scale__pin');
  var effectsList = uploadOverlay.querySelector('.img-upload__effects');
  var uploadText = uploadOverlay.querySelector('.img-upload__text');
  var textHashtags = uploadText.querySelector('.text__hashtags');


  var uploadOverlayEscPressHandler = function (evt) {
    var textDescription = uploadText.querySelector('.text__description');
    if (evt.keyCode === ESC_KEYCODE && evt.target !== textHashtags && evt.target !== textDescription) {
      closeUploadOverlay();
    }
  };
  var openUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', uploadOverlayEscPressHandler);
    resizeValue.value = '100%';
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
  scalePin.addEventListener('mouseup', function () {
    scaleValue.value = Math.round(scalePin.offsetLeft / scaleLine.offsetWidth * 100);

    var filter = '';
    var effectType = effectsList.querySelector('.effects__radio:checked').value;
    switch (effectType) {
      case 'chrome':
        filter = 'grayscale(' + scaleValue.value / 100 + ')';
        break;
      case 'sepia':
        filter = 'sepia(' + scaleValue.value / 100 + ')';
        break;
      case 'marvin':
        filter = 'invert(' + scaleValue.value + '%)';
        break;
      case 'phobos':
        filter = 'blur(' + scaleValue.value / 100 * 3 + 'px)';
        break;
      case 'heat':
        filter = 'brightness(' + (1 + scaleValue.value / 100 * 2) + ')';
        break;
    }
    uploadImgPreview.style.filter = filter;

  });

  var removeAllEffects = function () {
    uploadImgPreview.className = '';
    uploadImgPreview.style.filter = '';
  };
  var applyEffect = function (effectName) {
    removeAllEffects();
    uploadImgPreview.classList.add('effects__preview--' + effectName);
    if (effectName === 'none') {
      uploadScale.classList.add('hidden');
    } else {
      uploadScale.classList.remove('hidden');
    }
  };

  effectsList.addEventListener('click', function (evt) {
    var path = evt.path;
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

})();
