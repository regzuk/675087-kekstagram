'use strict';

(function () {
  var PHOTO_COUNT = 25;
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

  var generatePhotoOrder = function (n) {
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
  var createPhotoOption = function (photoNumber) {
    return {
      url: 'photos\/' + photoNumber + '.jpg'

    };
  };

})();
