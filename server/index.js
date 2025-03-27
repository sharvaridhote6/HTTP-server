const net = require("net"); // Import the net module
const fs= require("fs"); // Import the fs module
const path = require("path"); // Import the path module

let connectionCounter= 0;

const server = net.createServer((socket) => { // Create a new server
  const clientId = ++connectionCounter;   // Assign unique ID to each client
  console.log("Client connected");

  socket.on("data", (data) => { // Listen for data from the client
    const request = data.toString();// Convert the data to a string
    console.log(`Client ${clientId} - Received:\n${request}`);

    const [requestLine] = request.split("\r\n"); //parse the request line
    const [method, path] = requestLine.split(" "); // Extract the method and path from the request
    
     const headers = headerLines.reduce((acc, line) => { // Parse headers into an object w key-value pairs through reduce method and acc is the accumulator used to store the key-value pairs
      const [key, value] = line.split(": "); // Split the header into key and value
      if (key && value) {
        acc[key.toLowerCase()] = value; // Convert the key to lowercase
      }
      return acc;
    }, {});

   
    // Handle /user-agent endpoint
    if (method === "GET" && path === "/user-agent") {
      const userAgent = headers["user-agent"] || "Unknown"; // extract the User-Agent header or use "Unknown" if it's not present

      const responseBody = userAgent; // Use the User-Agent header as the body
      const contentLength = Buffer.byteLength(responseBody);

      const response = `HTTP/1.1 200 OK\r\n` +
        `Content-Type: text/plain\r\n` +
        `Content-Length: ${contentLength}\r\n` +
        `\r\n` +
        `${responseBody}`;

      socket.write(response);
    }

    // Handle /echo/{str} endpoint
    else if (method === "GET" && path.startsWith("/echo/")) {
      const echoStr = path.replace("/echo/", ""); // Extract the echo string

      const responseBody = echoStr;
      const contentLength = Buffer.byteLength(responseBody); 

      const response = `HTTP/1.1 200 OK\r\n` +
        `Content-Type: text/plain\r\n` +
        `Content-Length: ${contentLength}\r\n` +
        `\r\n` +
        `${responseBody}`;

      socket.write(response);
    } 
    // Handle root path
    else if (method === "GET" && path === "/") {
      const response = "HTTP/1.1 200 OK\r\n\r\n";
      socket.write(response);
    } 
    // Handle unknown paths
    else {
      const response = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(response);
    }

    socket.end(); // Close the connection after sending the response
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

// Start the server on port 4221
server.listen(4221, "localhost", () => {
  console.log("Server is running on localhost:4221");
});
