(function() {
  this.ParseParse = (function() {
    function ParseParse() {}

    ParseParse.save = function(model_name, params) {
      var Model, key, model, val;
      Model = Parse.Object.extend(model_name);
      model = new Model();
      for (key in params) {
        val = params[key];
        if (key.match(/_id$/)) {
          val = parseInt(val);
        }
        model.set(key, val);
      }
      return model.save(null, {
        error: function(model, error) {
          return console.log(error);
        }
      });
    };

    return ParseParse;

  })();

}).call(this);
