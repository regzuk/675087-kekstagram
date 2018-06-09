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
    var pictureElement = pictureTemplate.cloneNode (true);

    pictureElement.querySelector('img').src = pictureOption.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = pictureOption.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = pictureOption.comments.length;

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
  }

  var removeAllComments = function (pictureComments) {
    while (pictureComments.firstChild) {
      pictureComments.removeChild(pictureComments.firstChild);
    }
  };

  var createCommnetList = function (commentArray) {
    var fragment = document.createDocumentFragment();
    commentArray.forEach (function (textComment) {
      fragment.appendChild (createComment(textComment));
    });

    return fragment;
  };

  var showBigPicture = function (pictureOption) {
    var bigPicture = document.querySelector('.big-picture');
    bigPicture.classList.remove('hidden');

    bigPicture.querySelector('.big-picture__img img').src = pictureOption.url;
    bigPicture.querySelector('.likes-count').textContent = pictureOption.likes;
    bigPicture.querySelector('.comments-count').textContent = pictureOption.comments.length;
    bigPicture.querySelector('.social__caption').textContent = pictureOption.description;

    var bigPictureComments = bigPicture.querySelector('.social__comments');
    removeAllComments (bigPictureComments);

    bigPictureComments.appendChild(createCommnetList(pictureOption.comments));
    bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
  }

  var pictureArray = generatePictureOrder(PICTURE_COUNT).map(function (pictureNumber) {
    return createPictureOption(pictureNumber);
  });
  document.querySelector('.pictures').appendChild(createPictureList(pictureArray));

  showBigPicture(pictureArray[0]);

})();
