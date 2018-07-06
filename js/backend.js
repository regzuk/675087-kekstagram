'use strict';

(function () {
  var STATUS = {
    OK: 200
  };
  var ERROR = {
    STATUS_ERROR: 'Запрос не выполнен. Статус ответа: ',
    LOAD_ERROR: 'Запрос не выполнен. ',
    TIMEOUT_ERROR: 'Время выполнения запроса (в мс) превысило '
  };
  var URL = 'https://js.dump.academy/kekstagram';
  var addBackendResponseHandlers = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS.OK) {
        onLoad(xhr.response);
      } else {
        onError(ERROR.STATUS_ERROR + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError(ERROR.LOAD_ERROR + xhr.response);
    });
    xhr.addEventListener('timeout', function () {
      onError(ERROR.TIMEOUT_ERROR + xhr.timeout);
    });
  };
  var configureXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    addBackendResponseHandlers(xhr, onLoad, onError);
    return xhr;
  };
  window.backend = {
    load: function (onLoad, onError) {
      var xhr = configureXHR(onLoad, onError);

      xhr.open('GET', URL + '/data');
      xhr.send();
    },
    save: function (data, onLoad, onError) {
      var xhr = configureXHR(onLoad, onError);

      xhr.open('POST', URL);
      xhr.send(data);
    }
  };
})();
