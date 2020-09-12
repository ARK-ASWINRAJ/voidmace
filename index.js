const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/confessions', (req, res) => {
    res.sendFile(__dirname + '/public/confessions.html');
});

app.get('/technical', (req, res) => {
    res.sendFile(__dirname + '/public/technical.html');
});

app.get('/general', (req, res) => {
    res.sendFile(__dirname + '/public/general.html');
});

// tech namespace
const tech = io.of('/tech');

var online= {general:0, technical:0, confessions:0};

tech.on('connection', (socket) => {
    var currentRoomId;
    socket.on('join', (data) => {
        socket.join(data.room);
        currentRoomId = data.room;
        online[currentRoomId]=online[currentRoomId]+1;
        tech.in(data.room).emit('userjl', `New user joined ${data.room} room!.   Online:${online[currentRoomId]}`);
    })

    socket.on('message', (data) => {
        
        tech.in(data.room).emit('message', data.msg);
    });

   socket.on('disconnect', () => {
       
        online[currentRoomId]=online[currentRoomId]-1;
        tech.in(currentRoomId).emit('userjleft',  `User left the room!.   Online:${online[currentRoomId]}` );
          
    })
    
})

