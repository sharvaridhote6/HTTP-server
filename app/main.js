const net = require("net"); //allows you to create a tcp server and manage socket connections, this net module is built into Node.js

const server = net.createServer((socket) => { //create a TCP server and pass a callback function that will be called whenever a new connection is made to the server, and socket parameter represents each individual client that connects to the server
  socket.on("data",(data)=>{
    //log incoming data /requests from the client
    console.log(data.toString());

    const response="HTTP/1.1 200 OK\r\n\r\n"; //HTTP response header
    socket.write(response); //write the response to the client
    socket.end(); //close the connection
  })
    socket.on("close", () => { //listens for the close event which happens when the client disconnects\
    console.log("Client disconnected");
  });

});

server.listen(4221, "localhost");


