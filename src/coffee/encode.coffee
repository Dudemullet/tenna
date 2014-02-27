vueconf =
  el: "#mock"
  data : {
    complete : "0.00",
    eta: " "
  },
  ready : ->
    self = this
    self.videoname = self.$el.getAttribute("id")
    self.intervalId = setInterval () ->
      self.getData()
    , 1000
  methods : {
    getData : -> 
      self = this
      console.log "calling getData"
      $.get "/encode/status/" + self.videoname , (res) ->
        self.$data.eta = res.eta
        self.$data.complete = res.complete
  }

vueconf2 =
  el: "#souls"
  data : {
    complete : "0.00",
    eta: " "
  },
  ready : ->
    self = this
    self.videoname = self.$el.getAttribute("id")
    self.intervalId = setInterval () ->
      self.getData()
    , 1000
  methods : {
    getData : -> 
      self = this
      console.log "calling getData"
      $.get "/encode/status/" + self.videoname , (res) ->
        self.$data.eta = res.eta
        self.$data.complete = res.complete
  }

# $(".tile").each (i, val)->
#   vueconf.el = "#"+val.getAttribute("id")
#   new Vue vueconf
  
wtf = new Vue vueconf
rofl = new Vue vueconf2

