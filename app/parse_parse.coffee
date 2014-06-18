class @ParseParse
  @save: (model_name, params) ->
    Model = Parse.Object.extend(model_name)
    model = new Model()
    for key of params
      val = params[key]
      val = parseInt(val) if key.match(/_id$/)
      model.set(key, val)
    model.save(null, {error: (model, error) ->
      console.log error
    })

