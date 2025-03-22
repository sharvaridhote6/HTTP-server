const net = require("net"); //allows you to create a tcp server and manage socket connections, this net module is built into Node.js

const server = net.createServer((socket) => { //create a TCP server and pass a callback function that will be called whenever a new connection is made to the server, and socket parameter represents each individual client that connects to the server
  console.log("Client connected");

    socket.on("data",(data)=>{ //log incoming data /requests from the client
    console.log(data.toString()); //convert the data to a string

    const firstLine = data.toString().split("\r\n")[0]; 

    // Extract the path from the request
    const path = firstLine.split(" ")[1];  // Extracts the path part (e.g., `/` or `/unknown`)

    // Determine the response based on the requested path
    let response;
    if (path === "/") {
      response = "HTTP/1.1 200 OK\r\n\r\n";
    } else {
      response = "HTTP/1.1 404 Not Found\r\n\r\n";
    }

    // Send the response to the client
    socket.write(response);
    socket.end(); //closes the connection
  });
    socket.on("close", () => { //listens for the close event which happens when the client disconnects\
    console.log("Client disconnected");
  });

  socket.on("error", (err) => { //handles errors on the socket
    console.error(`Socket error: ${err.message}`);
  });

}); 

server.listen(4221, "localhost");


