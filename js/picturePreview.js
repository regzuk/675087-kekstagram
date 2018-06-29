'use strict';

(function () {

  var AVATAR_COUNT = 6;

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

  var createCommentList = function (commentArray) {
    var fragment = document.createDocumentFragment();
    commentArray.forEach(function (textComment) {
      fragment.appendChild(createComment(textComment));
    });

    return fragment;
  };

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  window.picturePreview = function (pictureOption) {
    bigPicture.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');
    document.addEventListener('keydown', bigPictureEscPressHandler);

    bigPicture.querySelector('.big-picture__img img').src = pictureOption.url;
    bigPicture.querySelector('.likes-count').textContent = pictureOption.likes;
    bigPicture.querySelector('.comments-count').textContent = pictureOption.comments.length;
    bigPicture.querySelector('.social__caption').textContent = pictureOption.description;

    var bigPictureComments = bigPicture.querySelector('.social__comments');
    removeAllComments(bigPictureComments);

    bigPictureComments.appendChild(createCommentList(pictureOption.comments));
    bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPicture.querySelector('.social__loadmore').classList.add('visually-hidden');
  };
  var closeBigPicture = function () {
    bigPicture.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
    document.removeEventListener('keydown', bigPictureEscPressHandler);
  };
  var bigPictureEscPressHandler = function (evt) {
    if (window.utils.isEnterEsc(evt)) {
      closeBigPicture();
    }
  };

  bigPictureCancel.addEventListener('click', function () {
    closeBigPicture();
  });

})();
