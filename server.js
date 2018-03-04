const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const PORT = 8080;

const server = http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on("error", err => {
        console.error(err);
      })
      .on("data", chunk => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body).toString();
      });

    response.on("error", err => {
      console.error(err);
    });

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");

    const responseBody = { headers, method, url, body };

    response.write(JSON.stringify(responseBody));
    response.end();
  })
  .listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  });
