var express = require('express');
var fs = require('fs');
var app = express();
var http = require('http');
var server = http.createServer(app);
var config = require("./settings/config.js");
var qsp = require("querystring");

var mailer = require("./BLL/Mailer.js");
var Jobs = require("./BLL/Jobs.js");
Jobs.start();


var tProc = require("./BLL/TemplateProcessor").Processor;
var dal = require("./DAL/dal").instance;

var url = require("url"),
    path = require("path"), 
    tm = require('./BLL/TemplateManager/');
var d = require('./BLL/TemplateManager/Direct');
var bs = require('./BLL/TemplateManager/BySocket');
var ax = require('./BLL/TemplateManager/AjaxTM');

var urlPull;
if(config.autoPack){
    var packer = require("./BLL/Packer/jsPacker.js");
    packer.Run();
}

var ws =  require('./BLL/ws/ws');
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use('/min', express.static(__dirname + '/Client/public/Min'));
app.use('/images', express.static(__dirname + '/Client/public/Images'));
app.use('/jquery', express.static(__dirname + '/Client/public/jquery'));
app.use('/pub', express.static(__dirname + '/Client/public'));
app.use('/prodpic', express.static(__dirname + '/Client/public/ProdPic'));
app.use('/sys', express.static(__dirname + '/Client/Sys/'));
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.send(500, 'There was a problem with this page');
});

dal.getUrlPull(function(pages){urlPull = pages;});

console.log(config.listen.port);
server.listen(config.listen.port);

var io = require('socket.io').listen(server);
//io.set('transports', ['xhr-polling']);


app.get('/EctMail.html', function(request, response){
      var uri = url.parse(request.url,true);    
    var tmplate = uri.query['t'];
    var data = uri.query['d'];
    mailer.toHtml(tmplate,data,function(htm){
        response.end(htm);
        });
    });

    app.post('/spindel', function (request, response) {
        
        var ob = JSON.parse(request.body.webReq);
        console.log(ob);
        if (request.body.type == 'ws') {
            ws.processAjax(ob, response);
            if (ob.funcName == "addRide") {
                var d = { srcAreaID: ob.params.srcAreaID, dstAreaID: ob.params.dstAreaID };

                chat.sockets.emit('newRideNotification', d);
                var dt = new Date();
                var time = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
                var txt = ob.params.companyName + ' הוסיפו נסיעה ' + ob.params.area + ' אל  ' + ob.params.destination + ' בתאריך ' + ob.params.aviliableDate;
                var data = { message: txt, username: ob.params.username, time: time , name:'<span style="color:red">הודעת מערכת</span>' };

                chat.sockets.emit('forumMsg', data);
                chat2all.push(data);
            }
         if (ob.funcName == "deleteRideFormMyRides") {
                var d = { rideID: ob.params.rideID, to: null };
                chat.sockets.emit('rideClose', d);
            }
        }
        else {
            var qs = ob.url.indexOf("?");
            var url = qs > -1 ? ob.url.substring(0, qs) : ob.url;
            if (qs > -1) {
                ob.qs = {};
                qs = ob.url.substring(qs + 1);
                var qsp = qs.split('&');
                for (var i = 0; i < qsp.length; i++) {
                    var a = qsp[i].split('=');
                    ob.qs[a[0]] = a[1];
                }
            }
            ob.cookies = request.cookies;

            if (urlPull[url]) {
                if (url != '/login' && url != '/register1' && !ws.isLogedIn(request))
                    url = '/login';
                var ajaxTm = new ax(ob, response, urlPull[url].Params);
                tProc.Process(urlPull[url].Template, ob.Container, ajaxTm);
            }
        }

    });

app.get('/uploadimg/', function(request, response){
    fs.readFile('./Content/Modules/Upload/imgUpload.html', "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
});

app.post('/uploadimg/', function (request, response) {
    fs.readFile(request.files.img.path, function (err, data) {
        var newPath = __dirname + "/Client/public/ProdPic/" + request.files.img.name;
        fs.writeFile(newPath, data, function (err) {
            response.end('<!DOCTYPE html><html><body dir="rtl" onload="parent.setProdImg(\'' +request.files.img.name + '\')"> התמונה עלתה בהצלחה <a href="../uploadimg/">החלף תמונה</a></body></html>');
        });
    });
});


app.get('/*', function(request, response){
    console.log(request.headers.host + request.url );
    var h = config.serve.host; 
        if (config.serve.port != 80 )  
            h += ':' + config.serve.port ;
   if(h.indexOf('www') > -1 && h !=  request.headers.host){
        response.writeHead(301, {"Location": 'http://' + h + request.url });
        response.end();
    }
    else{    
        var uri = url.parse(request.url,true);    
        var pathName = decodeURI(uri.pathname);
        if(urlPull && urlPull[pathName]){
            if (pathName != '/login' && pathName != '/register1' && !ws.isLogedIn(request)) {
                response.writeHead(302, {"Location": 'http://' + h + '/login' }); //  login page
                response.end();
            }else{
            var tmDirect = new d(request,response,urlPull[pathName].Params);
            tProc.Process(urlPull[pathName].Template,"",tmDirect)
            }
        }
        else
            sendResponse(response,"text/html",404,"404 Page can not be displied");
   }
});


function sendResponse (response,contentType,status,body){
        var headers = {};
        headers["Content-Type"] = contentType;
        response.writeHead(status, headers);
        response.write(body);
        response.end();
}

//var loadTime = new Date();
//var autoRefresh = io
//  .of('/autoRefresh')
//  .on('connection', function (socket) {
//   socket.on('getTime', function () {
//       socket.emit('loadTime', loadTime);
//       });
//  });


var chat = io
var chatUsers = {};
var rides = {};

var chat2all = [];

chat.sockets.on('connection', function (socket) {
 
    socket.on('hello', function (data) {
        if (!data.username) {
            socket.emit('Error', { err: 'you are not loged in' });
            return;
        }
        chatUsers[data.username] = socket;
    });

    socket.on('send2all', function (data) {
        chat.sockets.emit('forumMsg', data);
        chat2all.push(data);
    });

    socket.on('getChat2allHistory', function (d) {
        socket.emit('chat2allHistory', chat2all);
    });


    socket.on('send', function (data) {
        if (!data.username) {
            socket.emit('Error', { err: 'you are not loged in' });
            return;
        }
        chatUsers[data.username] = socket;
        if (!rides[data.rideID]) {

            dal.findOne('Rides', { _id: parseInt(data.rideID) }, { requests: 1 }, function (err, rs) {
                rides[data.rideID] = {};
                if (rs.requests) {
                    for (user in rs.requests) {
                        if (rs.requests.hasOwnProperty(user)) {
                            rides[data.rideID][user] = rs.requests[user].msgs;
                        }
                    }
                }

                addMsg2Owner(data)
            });
        }
        else
            addMsg2Owner(data);
       

    });

    function addMsg2Owner(data) {
        if (!rides[data.rideID][data.username]) {
            rides[data.rideID][data.username] = [];
            // append chat to ride db
            dal.addChatToRide(data.rideID, data.username, data.name, function (err, d) {
                if (err)
                    console.log(err);
                if (d)
                    sendMsg2Owner(data);
            });
        }
        else
            sendMsg2Owner(data);
    }

    function notify(msg) {
        dal.notify(msg, function () { });
        if (chatUsers[msg.to]) {
            dal.getUnreadNotificationCount(msg.to, function (err, c) {
                msg.count = c;
                chatUsers[msg.to].emit('notify', msg);
            });
            
        }
    }
    function sendMsg2Owner(data) {
        //append msg to ride db
        dal.addMsgToChat(data.rideID, data.username, data, function (err, d) {
            if (err)
                console.log(err);
            if (data)
                console.log(d);
        });

        if (rides[data.rideID] && rides[data.rideID][data.username])
            rides[data.rideID][data.username].push(data);

        notify({ from: data.username, to: data.toUser, type: 'RequestChat', rideID: parseInt(data.rideID) ,senderName:data.name, read:false,date: new Date(),msg:data.message});

        if (chatUsers[data.username])
            chatUsers[data.username].emit('message2User', data);
        if (chatUsers[data.toUser])
            chatUsers[data.toUser].emit('message2Owner', data);
    }

    socket.on('updateRidePrice', function (data) {
        if (!data.username) {
            socket.emit('Error', { err: 'you are not loged in' });
            return;
        }
        notify({ from: data.username, to: data.toUser, type: 'updateRidePrice', rideID: parseInt(data.rideID), senderName: data.name, read: false, date: new Date(), msg: data.message });
        dal.addPrice2Ride(data.rideID, data.toUser, data.price, function (err, d) {
            if (err)
                console.log(err);
            if (data)
                console.log(d);
        });
        chatUsers[data.username] = socket;

        if (chatUsers[data.toUser])
            chatUsers[data.toUser].emit('gotPrice', data);
    });

    socket.on('ownerApprovedAgreement', function (data) {
        if (!data.username) {
            socket.emit('Error', { err: 'you are not loged in' });
            return;
        }
        dal.ownerApprovedAgreement(data.rideID, data.toUser, new Date(), function (err, d) {
            notify({ from: data.username, to: data.toUser, type: 'ownerApprovedAgreement', rideID: parseInt(data.rideID), senderName: data.name, read: false, date: new Date(), msg: data.message });
            chat.sockets.emit('rideClose', { rideID: parseInt(data.rideID), to: data.toUser });
            // send mail
            ws.getOwnerAgreement(data, function (err, r) {
                mailer.send({
                    from: "Busnet <send@busnet.co.il>",
                    to: r.owner.firstName + " " + r.owner.lastName + " <" + r.owner.email + ">",
                    subject: "Busnet Agreement "
                }, 'Agreement', r);
                mailer.send({
                    from: "Busnet <send@busnet.co.il>",
                    to: r.customer.firstName + " " + r.customer.lastName + " <" + r.customer.email + ">",
                    subject: "Busnet Agreement "
                }, 'Agreement', r);
            });
        });
    });

    // customer approve agreement, still need owner approval
    socket.on('approveRideStatus', function (data) {
        if (!data.username) {
            socket.emit('Error', { err: 'you are not loged in' });
            return;
        }
        dal.approveRideStatus(data.rideID, data.username, data.isApproved, new Date(), function (err, d) {
            if (err)
                console.log(err);
            if (d) {
                console.log(d);
                if (data.isApproved) {
                    notify({ from: data.username, to: data.toUser, type: 'RideApproved', rideID: parseInt(data.rideID), senderName: data.name, read: false, date: new Date(), msg: data.message });
                   
                }
                else
                    notify({ from: data.username, to: data.toUser, type: 'PriceDeclined', rideID: parseInt(data.rideID), senderName: data.name, read: false, date: new Date(), msg: data.message });

            }
        });
        chatUsers[data.username] = socket;

        if (chatUsers[data.toUser])
            chatUsers[data.toUser].emit('gotRideStatus', data);
    });

    socket.on('reply', function (data) {
        if (!data.username) {
            socket.emit('Error', { err: 'you are not loged in' });
            return;
        }
       
        chatUsers[data.username] = socket;
        //append msg to ride db
        dal.addMsgToChat(data.rideID, data.toUser, data, function (err, d) {
            if (err)
                console.log(err);
            if (data)
                console.log(d);
        });
        notify({ from: data.username, to: data.toUser, type: 'Chat', rideID: parseInt(data.rideID), senderName: data.name, read: false, date: new Date(), msg: data.message });

        if(rides[data.rideID] && rides[data.rideID][data.toUser])
            rides[data.rideID][data.toUser].push(data);

        if (chatUsers[data.username])
            chatUsers[data.username].emit('message2Owner', data);
        if (chatUsers[data.toUser])
            chatUsers[data.toUser].emit('message2User', data);

    });
});


//var spindel = io
//  .of('/spindel')
//  .on('connection', function (socket) {
//     socket.on('get', function (ob) {
//       console.log(ob);
//       var qs = ob.url.indexOf("?");
//       var url = qs >-1 ? ob.url.substring(0,qs): ob.url;
//       if(qs > -1){
//           ob.qs = {};
//           qs = ob.url.substring(qs+1);
//           var qsp = qs.split('&');
//           for(var i=0; i < qsp.length; i++){
//               var a = qsp[i].split('=');
//               ob.qs[a[0]] = a[1];
//            }
//        }

//       if(urlPull[url]){
//            var tmBS = new bs(ob,socket,urlPull[url].Params);
//            tProc.Process(urlPull[url].Template,ob.Container,tmBS);
//        }
//    });

//    socket.on('ws', function (wsReq) {
//       console.log(wsReq);
//       ws.process(wsReq,socket);
//    });
//  });


console.log('Listening on ' + config.listen.host + ":" + config.listen.port);
