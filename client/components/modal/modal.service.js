'use strict';

angular.module('amonalieApp')
  .factory('Modal', function ($rootScope, $modal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $modal.open() returns
     */
    function openModal(scope, modalClass) {
      var modalScope = $rootScope.$new();
      scope = scope || {};
      modalClass = modalClass || 'modal-default';

      angular.extend(modalScope, scope);

      return $modal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete: function(del) {
          del = del || angular.noop;

          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed staight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
                name = args.shift(),
                deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Conferma Eliminazione',
                html: '<p>Sei SICURISSIMO di eliminare <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Elimina',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                  classes: 'btn-default',
                  text: 'Annulla',
                  click: function(e) {
                    deleteModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        },

        show: function() {
          return function () {
            var args = Array.prototype.slice.call(arguments),
              showModal;

            showModal = openModal({
              modal: {
                dismissable: true,
                title: 'Amonalia n°' + args[0].a.code,
                desc: args[0].a.app + ': ' + args[0].a.desc,
                a: args[0].a,
                template: 'components/gantt/gantt-detail.html',
                buttons: [{
                  classes: 'btn-primary',
                  text: 'OK',
                  click: function (e) {
                    showModal.dismiss(e);
                  }
                }],
                getDate: function(n) {
                  var d = new Date(n);
                  return d.getDate()+'/'+(d.getMonth()+1)+'/'+ d.getFullYear();
                }
              }
            }, 'modal-standard');
          }
        }
      }
    };
  });
