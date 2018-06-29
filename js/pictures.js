'use strict';

(function () {

  var createPictureElement = function (pictureOption, pictureTemplate) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('img').src = pictureOption.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = pictureOption.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = pictureOption.comments.length;

    pictureElement.querySelector('img').addEventListener('click', function () {
      window.picturePreview(pictureOption);
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

  window.backend.load(function (pictures) {
    document.querySelector('.pictures').appendChild(createPictureList(pictures));
  });

})();
