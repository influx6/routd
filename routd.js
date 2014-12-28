var sq = require("stackq");
var pm = require("pathmax");
var routd = module.exports = {};
var openEnded = /\*$/;

routd.Router = sq.Class({
  init: function(conf){
    this.config = sq.valids.isObject(conf) ? conf : {};
    this.routes = sq.Storage.make();
    this.events = sq.EventStream.make();

    this.events.hookProxy(this);

    this.events.events('404');
  },
  route: function(uri,method,conf,rurl){
    method = sq.valids.isString(method) ? method.toLowerCase() : method;
    var rt = this.routes.Q(uri);
    if(rt){
      if(rt.methods.indexOf(method) == -1){
        rt.methods.push(method);
      };
      return rt;
    };

    var dfc = sq.Util.extends({},this.config,conf);
    var urq = pm(uri || rurl,dfc);
    urq.methods = [];
    var ev = urq.events = sq.EventStream.make();
    urq.events.hookProxy(urq);
    urq.events = ev;

    this.events.events(uri);
    this.routes.add(uri,urq);

    this.events.on(uri,function(ux,cx,mx){
      if(cx){
        urq.events.emit(cx.toLowerCase(),ux,mx,cx);
      };
    });

    if(method) urq.methods.push(method);
    return urq;
  },
  get: function(uri){
    return this.routes.Q(uri);
  },
  unroute: function(uri){
    var m = this.routes.remove(uri);
    return m;
  },
  hasRoute: function(uri){
    return this.routes.has(uri);
  },
  analyze: function(url,method,payload){
    method = sq.valids.isString(method) ? method.toLowerCase() : method;
    var state = false;
    if(this.routes.isEmpty()){
      return this.events.emit('404',url,method,payload);
    };

    this.routes.each(this.$closure(function(e,i,o,fn){
      var c = e.collect(url);
      c.method = method;
      if(c.state){
        var isMethod = (e.methods.length > 0 && method && e.methods.indexOf(method) == -1);
        if(isMethod) return fn({ i: i, e: e});
        state = true;
        this.events.emit(i,c,method,payload);
      }else{
        c = null;
      }
      return fn(null);
    }),this.$closure(function(_,err){
      if(!state){
        this.events.emit('404',url,method,payload);
      }
    }));
  }
})
