'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram';
  var addBackendResponseHandlers = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Запрос не выполнен. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Запрос не выполнен. ' + xhr.response);
    });
    xhr.addEventListener('timeout', function () {
      onError('Время выполнения запроса превысило ' + xhr.timeout + 'мс');
    });
  };
  window.backend = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      addBackendResponseHandlers(xhr, onLoad, onError);

      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      addBackendResponseHandlers(xhr, onLoad, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
