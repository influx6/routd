var sq = require("stackq");
var pm = require("pathmax");
var routd = module.exports = {};

routd.Router = sq.Class({
  init: function(conf){
    this.config = sq.valids.isObject(conf) ? conf : {};
    this.routes = sq.Storage.make();
    this.events = sq.EventStream.make();

    this.on = this.events.$closure(this.events.on);
    this.off = this.events.$closure(this.events.off);
    this.once = this.events.$closure(this.events.once);
    this.offOnce = this.events.$closure(this.events.offOnce);

    // this.addRoot = function(){
    //   if(this.routes.has('/')) return this.get('/');
    //   this.events.events('/');
    //   var map = {
    //       methods: [],
    //       events: sq.EventStream.make(),
    //       collect: function(f){
    //         return {
    //           'config': sq.Util.extends({},this.config),
    //           'state': true,
    //           'meta':{
    //             'url': f,
    //           },
    //         }
    //       }
    //   };
    //   map.on = map.events.$closure(map.events.on);
    //   map.off = map.events.$closure(map.events.off);
    //   map.once = map.events.$closure(map.events.once);
    //   map.offOnce = map.events.$closure(map.events.offOnce);
    //   this.events.on('/',function(ux,cx,mx){
    //     if(cx){
    //       map.events.emit(cx.toLowerCase(),ux,mx);
    //     };
    //   });
    //   this.routes.add('/',map);
    //   return map;
    // }

    this.events.events('404');
  },
  route: function(uri,method,conf){
    method = sq.valids.isString(method) ? method.toLowerCase() : method;
    // if(uri == '/') return this.addRoot();
    var rt = this.routes.Q(uri);
    if(rt){
      if(rt.methods.indexOf(method) == -1){
        rt.methods.push(method);
      };
      return rt;
    };

    var dfc = sq.Util.extends({},this.config,conf);
    var urq = pm(uri,dfc);
    urq.methods = [];
    urq.events = sq.EventStream.make();

    urq.on = urq.events.$closure(urq.events.on);
    urq.off = urq.events.$closure(urq.events.off);
    urq.once = urq.events.$closure(urq.events.once);
    urq.offOnce = urq.events.$closure(urq.events.offOnce);

    this.events.events(uri);
    this.routes.add(uri,urq);

    this.events.on(uri,function(ux,cx,mx){
      if(cx){
        urq.events.emit(cx.toLowerCase(),ux,mx);
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
    this.routes.each(this.$closure(function(e,i,o,fn){
      var c = e.collect(url);
      if(c.state){
        var isMethod = (e.methods.length > 0 && method && e.methods.indexOf(method) == -1);
        if(isMethod) return fn(false);
        state = true;
        this.events.emit(i,c,method,payload);
      }else{
        c = null;
      }
      return fn(null);
    }),this.$closure(function(_,err){
      if(!state) this.events.emit('404',url,method,payload);
    }));
  }
})
