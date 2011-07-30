(function () {
  _app.controller({
    now: function() {
      console.timeEnd('Now');
    },
    later: function() {
      console.timeEnd('Later');
    }
  })
})();
