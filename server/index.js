import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import Connection from './database/db.js';
import Routes from './routes/Routes.js';


dotenv.config();
const app = express();

const PORT = 8000;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);


app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', Routes);



//  socket io

import { Server } from 'socket.io';

const io = new Server(9000, {
    cors: {
        origin: 'http://localhost:3000',
    }, 
})


let users = [];

const addUser = (userData, socketId) => {
    !users.some(user => user.sub === userData.sub) && users.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.sub === userId);
}
console.log("hello");
io.on('connection',  (socket) => {
    console.log('user connected')
    
    //connect
    socket.on("addUser", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    //send message
    // socket.on('sendMessage', (data) => {
    //     const user = getUser(data.receiverId);
    //     io.to(user.socketId).emit('getMessage', data)
        
    // })

    socket.on("sendMessage", (data) => {
        const user = getUser(data.receiverId);
        if (user) {
          io.to(user.socketId).emit("getMessage", data);
        } else {
          console.log(`User with ID is offline.`);
        }
    });

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})


// deployment

// import path from "path";
// // const path = require("path");

// app.get("/", (req, res) => {
//     app.use(express.static(path.resolve(__dirname, "frontend", "build")));
//     res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
// });

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));