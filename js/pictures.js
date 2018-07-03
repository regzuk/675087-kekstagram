'use strict';

(function () {

  var picturesContainer = document.querySelector('.pictures');
  var imgFilters = document.querySelector('.img-filters');
  var filterPopular = imgFilters.querySelector('#filter-popular');
  var filterNew = imgFilters.querySelector('#filter-new');
  var filterDiscussed = imgFilters.querySelector('#filter-discussed');

  var picturesList;


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

  var changeActiveImgFilterButton = function (activeButton) {
    imgFilters.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    activeButton.classList.add('img-filters__button--active');
  };

  var removePictures = function () {
    var upload = picturesContainer.removeChild(picturesContainer.querySelector('.img-upload'));
    while (picturesContainer.firstChild) {
      picturesContainer.removeChild(picturesContainer.firstChild);
    }
    picturesContainer.appendChild(upload);
  };

  var addPictures = function (pictures) {
    picturesContainer.appendChild(createPictureList(pictures));
  };

  var updatePictures = function (pictures) {
    removePictures();
    addPictures(pictures);
  };

  var debounceUpdatePictureList = window.utils.debounce(function (pics, button) {
    updatePictures(pics);
    changeActiveImgFilterButton(button);
  });

  var generatePictureOrder = function (arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
      var j = Math.floor(i * Math.random());
      var swap = arr[i];
      arr[i] = arr[j];
      arr[j] = swap;
    }
    return arr;
  };

  filterPopular.addEventListener('click', function () {
    debounceUpdatePictureList(picturesList, filterPopular);
  });

  filterNew.addEventListener('click', function () {
    debounceUpdatePictureList(generatePictureOrder(picturesList.slice()).slice(0, 10), filterNew);
  });

  filterDiscussed.addEventListener('click', function () {
    debounceUpdatePictureList(picturesList.slice().sort(function (a, b) {
      return b.comments.length - a.comments.length;
    }), filterDiscussed);
  });

  window.backend.load(function (pictures) {
    picturesList = pictures;
    addPictures(pictures);
    imgFilters.classList.remove('img-filters--inactive');
  }, window.utils.errorHandler);

})();
