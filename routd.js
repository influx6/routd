var sq = require("stackq");
var pm = require("pathmax");
var routd = exports = {};

routd.Router = sq.Class({
  init: function(conf){
    this.config = sq.valids.isObject(conf) ? conf : {};
    this.routes = sq.Storage.make();
    this.events = sq.EventStream.make();
  },
  route: function(uri,method,conf){
    var dfc = sq.Util.extends({},this.config,conf);
    var urq = pm(uri,dfc);
    urq.method = method;
    this.routes.add(uri,urq);
  },
  unroute: function(uri){
    var m = this.routes.remove(uri);
  },
  analyze: function(url,method){
    this.routes.each(this.$closure(function(e,i,o,fn){
      var c = e.collect();
      if(c.state){
        if(method && e.method != method) return fn(true);
        this.events.emit(i,c);
      }else{
        c = null;
      }
      return fn(null);
    }));
  }
})
