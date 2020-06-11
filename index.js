const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave , getRoomUsers} = require('./utils/users');

const app = express();
// needed for socket.io
const server = http.createServer(app);
const io = socketio(server);
// Set static folder
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/js')));

const botName = 'Home Base';
Aliens = [];
Bombs = [];

io.on('connection', socket => {
    socket.on('joinRoom', ({username,room}) => {

        if(getRoomUsers(room).length >= 2) {
            socket.emit('roomFull',formatMessage(botName,'this is room is full! try another id...'));
        }
        else {
            if(getRoomUsers(room).length >= 1) {
                socket.emit('message', formatMessage(botName,'WELCOME!'));
            }
            else {
                socket.emit('message', formatMessage(botName,'WELCOME! Waiting for another player to join...'));
            }
            const user = userJoin(socket.id, username, room);
            
            socket.join(user.room);
        
            // broadcast an entry except to client connecting
            socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined`));
            
            // send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
    
    // start game
    socket.on('start', (message) => {
        const user = getCurrentUser(socket.id);
        
        if(user != undefined && getRoomUsers(user.room).length > 1){
            socket.emit('playerOne')
        }
    });
    
    socket.on('createAliens', (aliens) => {
        const user = getCurrentUser(socket.id);
        Aliens = aliens;
        //console.log(`show ${Aliens[0].show} :x: ${Aliens[0].x}`) --> I have no idea why show is undefined here
        io.to(user.room).emit('begin', aliens);
    });

    socket.on('update', (data) => {
        const user = getCurrentUser(socket.id);
        Aliens = data.Aliens;
        Bombs = data.Bombs;
        //sending to all clients in 'game' room(channel) except sender
        if(user != undefined)
            socket.broadcast.to(user.room).emit('updated',data);
    });

    socket.on('chatMessage', (message) => {
        const user = getCurrentUser(socket.id);
        if(user != undefined)
            io.to(user.room).emit('message',formatMessage(user.username,message));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user != undefined){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left :/`));
            io.to(user.room).emit('dc');
            // send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});


const PORT = process.env.PORT || 3000;

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))