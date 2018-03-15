const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const PORT = 8080;

let publicFiles = {
  "/css/styles.css": true,
  "/404.html": true,
  "/helium.html": true,
  "/hydrogen.html": true,
  "/index.html": true
};

const loadGetRequest = (response, path) => {
  fs.readFile(`./public${path}`, (err, data) => {
    if (err) {
      loadGetRequest(response, "/404.html");
    } else if (!`./public${path}`) {
      loadGetRequest(response, "/404.html");
    } else {
      response.end(data);
    }
  });
};

const server = http
  .createServer((request, response) => {
    let { headers, method, url } = request;
    request.on("error", err => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    response.on("error", err => {
      console.error(err);
    });
    console.log("request: ", url);
    console.log("method: ", method);
    // console.log("headers: ", headers);

    //direct root directory to index.html file
    url = url === "/" ? "/index.html" : url;

    switch (method) {
      case "GET":
        loadGetRequest(response, url);
        break;
    }

    if (request.method === "POST") {
      request.setEncoding("utf8");
      request.on("data", chunk => {
        const data = querystring.parse(chunk);
        console.log(data);
        let newPageName = "./public/" + data.name + ".html";
        console.log("newPageName: ", newPageName);
        let newPage = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <title>The Elements - Helium</title>
            <link rel="stylesheet" href="/css/styles.css">
        </head>

        <body>
            <h1>${data.name}</h1>
            <h2>${data.symbol}</h2>
            <h3>Atomic number ${data.atomicNumber}</h3>
            <p>${data.name} is a chemical element with symbol ${
          data.symbol
        } and atomic number ${data.atomicNumber}. ${data.description}</p>
            <p>
                <a href="/">back</a>
            </p>
        </body>

        </html>`;

        fs.writeFile(newPageName, newPage, err => {
          if (err) {
            console.log("Error occured");
          } else {
            console.log("New page has been created");
          }
        });
        publicFiles[`/${data.name}.html`] = true;
        fs.writeFile(
          "./public/index.html",
          `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>The Elements</title>
            <link rel="stylesheet" href="/css/styles.css">
        </head>
        
        <body>
            <h1>The Elements</h1>
            <h2>These are all the known elements.</h2>
            <h3>These are 2</h3>
            <ol>
                <li>
                    <a href="/hydrogen.html">Hydrogen</a>
                </li>
                <li>
                    <a href="/helium.html">Helium</a>
                </li>
                <li>
                    <a href="${data.name}.html">${data.name
            .charAt(0)
            .toUpperCase() +
            data.name
              .split("")
              .slice(1)
              .join("")}</a>
                </li>
            </ol>
            <br>
            <br>
            <form action="/elements" method="post">
                <input type="text" name="name" value="element">
                <br>
                <br>
                <input type="text" name="symbol" value="symbol">
                <br>
                <br>
                <input type="text" name="atomicNumber" value="atomic number">
                <br>
                <br>
                <input type="text" name="description" value="description">
                <br>
                <br>
                <input type="submit" value="submit">
            </form>
        </body>
        
        </html>`,
          err => {
            if (err) {
              console.log("Error occured");
            } else {
              console.log("New page has been created");
            }
          }
        );
      });
    }
  })
  .listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  });
