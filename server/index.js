const net = require("net");                 // Import net module to create TCP server
const fs = require("fs");                   // Import file system module
const path = require("path");               // Import path module

const server = net.createServer((socket) => {
  console.log("Client connected");

  let requestData = "";  // Variable to store incoming data

  // 🔥 Listen for data from the client whenever client sends a req
  socket.on("data", (data) => {
    requestData += data.toString();         // Append incoming data
  });

  socket.on("end", () => {
    console.log(`Received:\n${requestData}`);

    // ✅ Split request into header and body
    const [header, body] = requestData.split("\r\n\r\n");

    // ✅ Parse the request line and headers
    const [requestLine, ...headerLines] = header.split("\r\n");
    const [method, path] = requestLine.split(" ");

    // ✅ Handle POST /files/{filename}
    if (method === "POST" && path.startsWith("/files/")) {
      const filename = path.replace("/files/", "");
      const filePath = path.join("/tmp", filename);

      // Write the body content to the file
      fs.writeFile(filePath, body, (err) => {
        if (err) {
          console.error("File write error:", err);
          const response = "HTTP/1.1 500 Internal Server Error\r\n\r\n";
          socket.write(response);
        } else {
          console.log(`File created: ${filePath}`);
          const response = "HTTP/1.1 201 Created\r\n\r\n";
          socket.write(response);
        }
        socket.end();
      });

    } 
    // ✅ Handle GET /files/{filename}
    else if (method === "GET" && path.startsWith("/files/")) {
      const filename = path.replace("/files/", "");
      const filePath = path.join("/tmp", filename);

      fs.readFile(filePath, (err, data) => {
        if (err) {
          const response = "HTTP/1.1 404 Not Found\r\n\r\n";
          socket.write(response);
        } else {
          const response = `HTTP/1.1 200 OK\r\n` +
            `Content-Type: application/octet-stream\r\n` +
            `Content-Length: ${data.length}\r\n\r\n` +
            data;
          socket.write(response);
        }
        socket.end();
      });

    } 
    // ✅ Handle invalid paths
    else {
      const response = "HTTP/1.1 404 Not Found\r\n\r\n";
      socket.write(response);
      socket.end();
    }
  });

  // ✅ Handle errors
  socket.on("error", (err) => {
    console.error(`Socket error: ${err.message}`);
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

// ✅ Start server
const PORT = 4221;
server.listen(PORT, "localhost", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
