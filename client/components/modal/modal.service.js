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

        edittask: function(stt) {
          stt = stt || angular.noop;

          return function() {
            var args = Array.prototype.slice.call(arguments),
              taskModal;

            var buttons =[];
            if (!args[0].readonly) {
              buttons.push({
                classes: 'btn-warning',
                text: 'Applica',
                click: function (e) {
                  applyValues();
                  taskModal.close(e);
                }
              });
            }
            buttons.push({
              classes: 'btn-primary',
                text: 'Chiudi',
                click: function(e) {
                  taskModal.dismiss(e);
                  if(args[1] && args[1].reject)
                    args[1].reject();
                }
            });

            taskModal = openModal({
              modal: {
                dismissable: true,
                title: args[0].title,
                template: 'components/task/task-modal.html',
                info: args[0],
                collapsed:true,
                buttons: buttons,
                states:['dafare','fando','fatto'],
                getDate: function(n) {
                  var d = new Date(n);
                  return d.getDate()+'/'+(d.getMonth()+1)+'/'+ d.getFullYear();
                }
              }
            }, 'modal-standard');

            var applyValues = function(){
              if (args[0].state)
                args[0].a.state = args[0].state;
            };

            taskModal.result.then(function(event) {
              stt.apply(event, args);
            });
          };
        },

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
                  classes: 'btn-danger',
                  text: 'Archivia',
                  click: function (e) {
                    args[0].history = true;
                    targetModal.close(e);
                  }
                },{
                  classes: 'btn-warning',
                  text: 'Applica',
                  click: function (e) {
                    targetModal.close(e);
                  }
                },{
                  classes: 'btn-primary',
                  text: 'Chiudi',
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
            });
          }
        }
      }
    };
  });
