Routd
=====

 simple and efficient routing library based on the pathmax (https://github.com/influx6/pathmax) url pattern library

##Installation
  
    npm install routd
  
##Example

Lets require and setup an instance of router ready to kickass
 
    var rx = require('../routd.js');
  
    var r = rx.Router.make();
  
    /*
      Router.prototype.route
      Args: route, method, config
      route: the route intended to watch for
      method: the http method intend to watch only for
      config: these are pathmax configuration options,
    eg {
     exactMatch: true | false, -> lets you decide if its must be a strict match or not
     noQuery: true | false, -> ensure either to allow urls to have querystrings or fail if they do when this is false
     lockHash: true | false, -> incase a hash pattern is giving as route,ensure the request url matches with location of hashtag '#'
     params:{
        //define the params and their type eg
        id: 'digits', -> ensure the id param is a numver
        name: 'text' -> ensure its a string,can contain both numbers,letters and symbols
      },
      validators:{
        //define custom validators or rewrite the normal ones
        digits: function(f){
          return typeof f === 'number';
        }
      }
      }
    */
  
    r.route('/blog','post',{});
  
  Lets add 'get' to the wanted http methods to watch for:
  
    r.route('/blog','get'); 
  
  Or just push it into the method list associated with the route
    
    r.get('/blog').methods.push('get');
    
  Now we can listen in for routes that match and the corresponding meta object returned
  
    d.on('/blog',function(f){
      //lets listen for a general purpose matches all requests       
    });
  
    r.get('/blog')
    .on('get', function(){
      //lets listen for only get http methods
    })
    .on('post',function(){
      //lets listen for only post http methods
    });
  
  
  Let's send in urls to check against:
  
    d.analyze('/blog','post');
   
