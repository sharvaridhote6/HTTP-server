const net = require("net");

const server = net.createServer((socket) => {
  console.log("Client connected");

  socket.on("data", (data) => {
    const request = data.toString();
    console.log(`Received:\n${request}`);

    const [requestLine] = request.split("\r\n");
    const [method, path] = requestLine.split(" ");

    if (method === "GET" && path.startsWith("/echo/")) {
      const echoStr = path.replace("/echo/", "");

      const responseBody = echoStr;
      const contentLength = Buffer.byteLength(responseBody);

      const response = `HTTP/1.1 200 OK\r\n` +
        `Content-Type: text/plain\r\n` +
        `Content-Length: ${contentLength}\r\n` +
        `\r\n` +
        `${responseBody}`;

      socket.write(response);
    } 
    else if (method === "GET" && path === "/") {
      const response = "HTTP/1.1 200 OK\r\n\r\n";
      socket.write(response);
    } 
    else {
      const response = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(response);
    }

    socket.end();
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

server.listen(4221, "localhost", () => {
  console.log("Server is running on localhost:4221");
});
