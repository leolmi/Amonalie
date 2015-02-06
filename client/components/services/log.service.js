/**
 * Created by Leo on 06/02/2015.
 */
'use strict';

angular.module('amonalieApp')
  .factory('Logger', function(toastr){
    function getToastrSettings(){
      return {
        allowHtml: true,
        closeButton: false,
        closeHtml: '<button>&times;</button>',
        containerId: 'toast-container',
        extendedTimeOut: 1000,
        iconClasses: {
          error: 'toast-error',
          info: 'toast-info',
          success: 'toast-success',
          warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        positionClass: 'toast-bottom-right',
        tapToDismiss: true,
        timeOut: 5000,
        titleClass: 'toast-title',
        toastClass: 'toast'
      }
    }

    var toastOk = function(content, header){
      toastr.success(header, content, getToastrSettings());
    };

    var toastError = function(content, header){
      toastr.error(header, content, getToastrSettings());
    };

    var toastInfo = function(content, header){
      toastr.info(header, content, getToastrSettings());
    };

    var toastWarning = function(content, header){
      toastr.warning(header, content, getToastrSettings());
    };

    return {
      ok: toastOk,
      error: toastError,
      info: toastInfo,
      warning: toastWarning
    }
  });
