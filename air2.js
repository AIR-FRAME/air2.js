//Author: Bobby Thomas (bobtxt@gmail.com)

var Air2 = function(){};

Air2._events = [];
Air2.bind = function(eventName, callBack){
   Air2._events.push( { "eventname": eventName, "callback": callBack } );
}

Air2.trigger = function(eventName){	
   var eventObject = Air2._events.find((it) => { return it.eventname === eventName; });
   if(eventObject){
      eventObject.callback();
   }
}

if( typeof module !== "undefined" && ('exports' in module)){
   module.exports = Air2;
}