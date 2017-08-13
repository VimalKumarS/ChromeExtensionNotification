var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs')
var _ = require('underscore');
app.listen(3000);

var clients = {};
var rooms = [];
function handler(req, res) {
    fs
        .readFile(__dirname + '/index.html', function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

io
    .sockets
    .on('connection', function (socket) {

        socket
            .on('add-user', function (data) {
                clients[data.username] = {
                    "socket": socket.id
                };
            });

        socket.on('private-message', function (data) {
            console.log("Sending: " + data.content + " to " + data.username);
            if (clients[data.username]) {
                io
                    .sockets
                    .connected[clients[data.username].socket]
                    .emit("add-message", data);
            } else {
                console.log("User does not exist: " + data.username);
            }

            //if(socket.rooms[data.username] != null){
            if (_.contains(rooms, data.username)) {
                    //check if room exists
                    io
                        .to(data.username)
                        .emit("add-message", data);
                }
            });

            //Removing the socket on disconnect
            socket.on('disconnect', function () {
                for (var name in clients) {
                    if (clients[name].socket === socket.id) {
                        delete clients[name];
                        delete rooms[name];
                        socket.leave(name); // leave room
                        break;
                    }
                }
            });
            
            socket.on('create-room', function (room) {
                if (!_.contains(rooms, room)) {
                    rooms.push(room);
                    
                }
                socket.join(room);
                //socket.emit('updaterooms', rooms, socket.room);
            });
        });
