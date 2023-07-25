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

function emitNewClient() {
    clientPipes.forEach((cPipe) => {
        cPipe.emit("new client", {
            message: clientPipes.length
        })
    })
}

sockerIO.on("connection", (pipe) => {
    console.log("A new user socket is Connected");
    // when ever a new client is connected add the client pipe to the array
    clientPipes.push(pipe)

    // this function is called when ever a new client is connected
    emitNewClient()

    pipe.on("msg", (data) => {
        // data -> {message: "", userName: "vijay"}
        console.log("Data received from the client", data);

        // loop through all pipes and forward the message to all the clients
        clientPipes.forEach((cPipe) => {
            cPipe.emit("server msg", {
                message: "server received msg: "+data.message,
            })
        })

        // we use emit to send data through pipe

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