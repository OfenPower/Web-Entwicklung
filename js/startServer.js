const http = require("http");

const port = process.argv[2];

http.createServer((request, response) => {
    let data = "Hello World!";
    response.writeHead(200, {"Content-Type": "text/plain", "Content-Length": data.length});
    response.end(data);
}).listen(port, () => {console.log("HTTP-Server listening on Port %d", port); });
