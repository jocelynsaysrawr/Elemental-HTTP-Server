const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const PORT = 8080;

const server = http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    request.on("error", err => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    response.on("error", err => {
      console.error(err);
    });

    switch (request.method === "GET") {
      case url === "/":
        fs.readFile("./public/index.html", (err, data) => {
          if (err) throw err;
          response.end(data);
        });
        console.log("request: ", url);
        console.log("method: ", request.method);
        break;
      case url === "/css/styles.css":
        fs.readFile("./public/styles.css", (err, data) => {
          if (err) throw err;
          response.end(data);
        });
        break;
      case url === "/hydrogen.html":
        fs.readFile("./public/hydrogen.html", (err, data) => {
          if (err) throw err;
          response.end(data);
        });
        break;
      case url === "/helium.html":
        fs.readFile("./public/helium.html", (err, data) => {
          if (err) throw err;
          response.end(data);
        });
        break;
      default:
        fs.readFile("./public/404.html", (err, data) => {
          if (err) throw err;
          response.end(data);
        });
    }
  })
  .listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  });
