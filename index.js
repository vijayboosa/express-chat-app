const express = require("express")

const http = require("http")

const app = express()

const server = http.createServer(app);

const { Server } = require("socket.io");
const sockerIO = new Server(server)



const port = 8080
// create the express server
app.set("view engine", "ejs")

sockerIO.on("connection", (pipe) => {
    console.log("A new user socket is Connected");
})


app.get("/", (req, res) => {
    res.render("index")
})


// run the express server
// port number is important
server.listen(port, () => {
    console.log(`Server start: http://127.0.0.1:${port}`);
})