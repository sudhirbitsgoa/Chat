//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://'+process.env.IP+'/test');
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
router.use(express.bodyParser());
router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];


/* 
 *schema defination ofthe messages"
 */
 
var messages = new mongoose.Schema({
  message : { type:'string',required:true}
});

var messages_model = mongoose.model('messages',messages);

router.get('/api/messages',function(req,res){
  //res.json("started to work fine");
  messages_model.find(function(err,messages){
    console.log("inside find messages ");
    res.json(messages);
  })
});

router.post('/api/messages',function(req,res){
    var message = {message:req.body.message};
    var message_add = new messages_model(message);
    message_add.save(function(){
        res.json("message saved successfully");
    });
})

router.delete('/api/messages/:message_id',function(req,res){
    var message_id = req.params.message_id;
    messages_model.remove({_id:message_id},function(){
        res.json("message removed successfully");
    })
})

router.post('/api/messages/:message_id',function(req,res){
  var message_id =req.params.message_id;
  var message = {message:req.body.message};
  
  messages_model.findById(message_id,function(err,docs){
  if(err){
    res.json("user does'nt exist");
  }else{
    messages_model.update(docs,message,{multi:false},function(err,nums){
      res.json("updated successfully");
    });
  }
  })
  
})
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
