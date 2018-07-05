'use strict';

(function () {

  var AVATAR_COUNT = 6;
  var COMMENT_COUNT = 5;

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

  var createCommentList = function (commentArray, startNumber) {
    startNumber = startNumber || 0;
    var fragment = document.createDocumentFragment();
    commentArray.slice(startNumber, startNumber + COMMENT_COUNT).forEach(function (textComment) {
      fragment.appendChild(createComment(textComment));
    });

    return fragment;
  };

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
  var bigPictureComments = bigPicture.querySelector('.social__comments');
  var bigPictureLoadComment = bigPicture.querySelector('.social__loadmore');
  var bigPictureCommentCount = bigPicture.querySelector('.social__comment-count');

  window.picturePreview = function (pictureOption) {

    bigPicture.classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');

    bigPicture.querySelector('.big-picture__img img').src = pictureOption.url;
    bigPicture.querySelector('.likes-count').textContent = pictureOption.likes;
    bigPicture.querySelector('.comments-count').textContent = pictureOption.comments.length;
    bigPicture.querySelector('.social__caption').textContent = pictureOption.description;

    removeAllComments(bigPictureComments);
    bigPictureCommentCount.classList.add('hidden');

    bigPictureComments.appendChild(createCommentList(pictureOption.comments));
    if (pictureOption.comments.length <= COMMENT_COUNT) {
      bigPictureLoadComment.classList.add('hidden');
    }

    var loadCommentHandler = function () {
      bigPictureComments.appendChild(createCommentList(pictureOption.comments, bigPictureComments.childElementCount));
      if (pictureOption.comments.length === bigPictureComments.childElementCount) {
        bigPictureLoadComment.removeEventListener('click', loadCommentHandler);
        bigPictureLoadComment.classList.add('hidden');
      }
    };

    var closeBigPicture = function () {
      bigPictureLoadComment.classList.remove('hidden');
      bigPicture.classList.add('hidden');
      document.querySelector('body').classList.remove('modal-open');
      bigPictureLoadComment.removeEventListener('click', loadCommentHandler);
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
    bigPictureLoadComment.addEventListener('click', loadCommentHandler);
    document.addEventListener('keydown', bigPictureEscPressHandler);
  };

})();
