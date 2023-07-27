// import express
const express = require("express")

// import the http server
const http = require("http")

// create the express server
const app = express()

// create the http server wrap the express server
const server = http.createServer(app);

// import socket server
const { Server } = require("socket.io");

// wrap the http server with socket io server
const sockerIO = new Server(server)


const clientPipes = []

const port = 8080
// create the express server
app.set("view engine", "ejs")

// this function takes send message to a pipe for a specific topic
// pipe -> which pipe the data should be sent
// topic -> which topic msg to be sent
// msg -> actual data to be sent
function emitMessage(pipe, topic, msg) {
    console.log(pipe.connected);
    // if pipe is not connected
    if (!pipe.connected) {
        // remove the pipe from the clientPipes array
        removeClient(pipe)
        return
    }

    pipe.emit(topic, msg)
}

// this function will send no of client connected information 
// (Number of clients connect)
function emitClientConnection() {
    clientPipes.forEach((cPipe) => {
        // cPipe.emit("client connections", {
        //     message: clientPipes.length
        // })
        const msg = {
            message: clientPipes.length
        }
        emitMessage(cPipe, "client connections", msg)
    })
}

// this function takes a pipe as a argument and removes the 
// pipe from the clientPipes Array
function removeClient(pipe) {
    const index = clientPipes.indexOf(pipe)
    if (index > -1) {
        // remove the pipe from the clientPipes array
        clientPipes.splice(index, 1)
        // update all the pipes in the clientPipe array about the connections
        emitClientConnection()
    }
}

function disconnectTopic(pipe) {
    pipe.on("disconnect", () => {
        console.log("client disconnected..");
        // this function removes the pipe from the clientPipes array
        removeClient(pipe)

        emitClientConnection()
    })
}

sockerIO.on("connection", (pipe) => {
    console.log("A new user socket is Connected");
    // when ever a new client is connected add the client pipe to the array
    clientPipes.push(pipe)

    // this function is called when ever a new client is connected
    emitClientConnection()

    pipe.on("msg", (data) => {
        // dnsole.log("Data received from the client", data);

        // cPipe.emit("server msg", {
        //     message: "server received msg: "+data.message,
        // })
        const msg = { message: data.message , userName: data.userName}
        // loop through all pipes and forward the message to all the clients
        clientPipes.forEach((cPipe) => {
            emitMessage(cPipe, "server msg", msg)
        })

    })
})


app.get("/", (req, res) => {
    res.render("index")
})


// run the express server
// port number is important
server.listen(port, () => {
    console.log(`Server start: http://127.0.0.1:${port}`);
})