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
                  classes: 'btn-primary',
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
        /**
         * Modifica un'attività
         * @param {Function} stt - funzione chiamata alla conferma del dialog
         * @returns {Function}   - funzione per aprire il dialog
         */
        editamonalia: function(stt) {
          stt = stt || angular.noop;

          return function() {
            var args = Array.prototype.slice.call(arguments),
              taskModal;

            var buttons =[];
            if (!args[0].readonly) {
              buttons.push({
                classes: 'btn-danger onleft',
                text: args[0].a.archived ? 'Ripristina' : 'Archivia',
                click: function (e) {
                  args[0].history = true;
                  taskModal.close(e);
                }
              });
              buttons.push({
                classes: 'btn-success',
                text: 'Applica',
                click: function (e) {
                  taskModal.close(e);
                }
              });
            }
            buttons.push({
              classes: 'btn-primary',
                text: args[0].readonly ? 'Chiudi' : 'Annulla',
                click: function(e) {
                  taskModal.dismiss(e);
                  if(args[0].def && args[0].def.reject)
                    args[0].def.reject();
                }
            });

            taskModal = openModal({
              modal: {
                dismissable: true,
                htmltitle: args[0].title,
                template: 'components/amonalia/amonalia-modal.html',
                info: args[0],
                buttons: buttons
              }
            }, 'modal-standard');

            taskModal.result.then(function(e) {
              stt.apply(e, args);
            },function() {
              if(args[0].def && args[0].def.reject)
                args[0].def.reject();
            });
          };
        },
        /**
         * Gestisce contemporaneamente più amonalie
         * @param cb
         * @returns {Function}
         */
        editlist : function (cb) {
          cb = cb || angular.noop;
          return function () {
            var args = Array.prototype.slice.call(arguments),
              editModal;

            editModal = openModal({
              modal: {
                dismissable: true,
                title: args[0].title,
                template: 'components/amonalia/amonalie-list-modal.html',
                info: args[0],
                buttons: [{
                  classes: 'btn-success',
                  text: 'Applica',
                  click: function(e) {
                    editModal.close(e);
                  }
                }, {
                  classes: 'btn-primary',
                  text: 'Annulla',
                  click: function(e) {
                    editModal.dismiss(e);
                  }
                }]
              }
            }, 'modal-standard');

            editModal.result.then(function(e) {
              cb.apply(e, args);
            },function() {
              if(args[0].def && args[0].def.reject)
                args[0].def.reject();
            });
          }
        },

        /**
         * Modifica un obiettivo
         * @param {Function} edt - funzione chiamata alla conferma del dialog
         * @returns {Function}   - funzione per aprire il dialog
         */
        edittarget : function(edt) {
          edt = edt || angular.noop;

          return function () {
            var args = Array.prototype.slice.call(arguments),
              targetModal;

            targetModal = openModal({
              modal: {
                dismissable: true,
                title: args[0].title,
                target: args[0].target,
                clone:args[0].obj,
                template: 'components/target/target-modal.html',
                buttons: [{
                  classes: 'btn-danger onleft',
                  text: args[0].target.archived ? 'Ripristina' : 'Archivia',
                  click: function (e) {
                    args[0].history = true;
                    targetModal.close(e);
                  }
                },{
                  classes: 'btn-success',
                  text: 'Applica',
                  click: function (e) {
                    targetModal.close(e);
                  }
                },{
                  classes: 'btn-primary',
                  text: 'Annulla',
                  click: function(e) {
                    targetModal.dismiss(e);
                    if(args[1] && args[1].reject)
                      args[1].reject();
                  }
                }]
              }
            }, 'modal-standard');

            targetModal.result.then(function(e) {
              edt.apply(e, args);
            },function() {
              if(args[1] && args[1].reject)
                args[1].reject();
            });
          }
        }
      }
    };
  });
