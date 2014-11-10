var sq = require('stackq'),
    rx = require('../routd.js');

sq.Jazz('pathmax specifications',function(_){

  var r = rx.Route.make();
  
  _('can i add a route: /home ?',function($){
    $.sync(function(d,g){
      sq.Expects.truthy(books.validate(d))
    });
    $.for(r);
  });

});
