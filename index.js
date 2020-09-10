const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

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


tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('userjl', `New user joined ${data.room} room!`);
    })

    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('message', data.msg);
    });

    socket.on('disconnect', () => {
        
        console.log('user disconnected');

        tech.emit('userjl',  `User left the room!.` );
    })
})
