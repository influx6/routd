var sq = require('stackq'),
    rx = require('../routd.js');

sq.Jazz('pathmax specifications',function(_){

  var r = rx.Router.make();
  r.route('/',null,{
    exactMatch: false,
  });

  r.route('/blog','post');

  _('can i add a route: /home ?',function($){
    $.sync(function(d,g){
      d.route('/home');
      sq.Expects.truthy(d.hasRoute('/home'));
    });
    $.for(r);
  });

  _('can i send a route request to /home ?',function($){
    $.sync(function(d,g){
      d.on('/home',g(function(f){
        sq.Expects.truthy(f.state);
      }));
      d.analyze('/home');
    });
    $.for(r);
  });

  _('can i send a route post request to /blog ?',function($){
    $.sync(function(d,g){
      d.on('/blog',g(function(f){
        sq.Expects.truthy(f.state);
      }));
      d.analyze('/blog','post');
    });
    $.for(r);
  });
});
