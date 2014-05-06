decimalFormatter = (value, arg) ->
  amt = if arg then arg[0] else 0
  return parseInt(value,10).toFixed(amt)


vueconf =
  ready : ->
    self = this
    self.videoname = self.$el.getAttribute("id")
    self.getData()
  computed : {
    amtComplete : {
      $get : ()->
        return decimalFormatter(this.complete)+"%"
    }
  }
  methods : {
    getData : -> 
      self = this
      $.get "/encode/status/" + self.videoname , (res) ->
        self.eta = res.eta
        self.complete = res.percentComplete
      .done (res) ->
        setTimeout( ()->
          self.getData()
        ,300)
      .fail (res) ->
        if(res.status == 404)
          self.$destroy()
        else
          setTimeout self.getData,1500
  }
  filters : {
    decimals : decimalFormatter
  }

$(".tile").each (i, val)->
  vueconf.el = "#"+val.getAttribute("id")
  vueconf.data = {
    complete : "0.00%",
    eta: "eta"
  }
  new Vue vueconf
