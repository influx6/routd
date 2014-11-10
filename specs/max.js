var sq = require('stackq'),
    mx = require('../pathmax.js');

var books = mx('/books/:id/bookStore#:title?name=alex&age=16',{
  'lockHash': true,
  'noQuery': true,
  'params':{
    'id':'digits',
    'title': 'text'
  }
});

sq.Jazz('pathmax specifications',function(_){

  var q1 = '/books/34/bookStore/boxers';
  var q2 = '/books/34/bookStore#boxers';
  var r1 = '/books/r23/bookStore/slave1';
  var r2 = '/books/23#bookStore/slave2';
  var r3 = '/books/23/bookStore/slave2?name=alex&age=20';

  _('can i validate url: '+q1+' to be valid?',function($){
    $.sync(function(d,g){
      sq.Expects.truthy(books.validate(d))
    });
    $.for(q1);
  });

  _('can i validate url: '+q2+' to be valid?',function($){
    $.sync(function(d,g){
      sq.Expects.truthy(books.validate(d))
    });
    $.for(q2);
  });

  _('can i validate url: '+r1+' to be invalid?',function($){
    $.sync(function(d,g){
      sq.Expects.falsy(books.validate(d))
    });
    $.for(r1);
  });

  _('can i validate url: '+r2+' to be invalid?',function($){
    $.sync(function(d,g){
      sq.Expects.falsy(books.validate(d))
    });
    $.for(r2);
  });

  _('can i validate url: '+r3+' to be invalid because of querystring?',function($){
    $.sync(function(d,g){
      sq.Expects.falsy(books.validate(d))
    });
    $.for(r3);
  });
});
