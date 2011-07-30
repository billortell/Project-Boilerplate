(function ( $, window, document, undefined ) {

  var app, _config;

  app = {
    modules : {}
  };

  // Change to your preferred namespace
  app.name = '_app';

  // Setup some defaults
  _config = {
    modules_dir     : '/app/modules',
    controllers_dir : '/app/controllers',
    models_dir      : '/app/models',
    views_dir       : '/app/views'
  };

  // Get a config variable
  app.get = function (key) {
    return _config[key];
  };

  // Set a config variable
  app.set = function (key, value) {
    _config[key] = value;
    return _config[key];
  };

  // Safely stash a module into the modules object
  app.module = function (name, module) {
    app.modules[name] = {};
    module.call(app.modules[name], $, app.modules);
  };

  // Execute code and expose the App to the code
  app.controller = function (controller) {
    var required = controller.require || null, toload = [];

    if (required && required.length && required instanceof Array) {
      for (var i = 0, l = required.length; i < l; i++) {
        if (typeof app.modules[required[i]] === 'undefined') {
          toload[toload.length] = [app.get('modules_dir'), required[i], '.js'].join('');
        }
      }
    }

    if (toload.length > 0) {
      try {
        yepnope({
          load: toload,
          complete: function () {
            _runController(controller);
          }
        });
      } catch (e) {
        throw 'yepnope.js is required for dynamic modules. ' + toload.join(', ') + ' not loaded.';
      }
    } else {
      _runController(controller);
    }
  };

  function _runController(controller) {
    var newObj = {
      $ : $
    };

    controller = $.extend({}, newObj, controller);

    if (controller.now) {
      controller.now.call(controller, app.modules, window, document);
    }

    if (controller.later) {
      $(function () {
        controller.later.call(controller, app.modules);
      });
    }
  }

window[app.name] = app;

})( jQuery, window, document );
