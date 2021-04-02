let http = require("http");
let fs = require("fs");
let path = require("path");

const port = 80;

console.log("Server starting...");
http
  .createServer(function (req, res) {

    let filePath = "./public" + req.url;
    console.log('requesting: ' + filePath);
    if (filePath == "./public/") filePath = "./public/index.html";

    let extname = path.extname(filePath);
    let contentType = "text/html";

    let contentTypes = {
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".wav": "audio/wav",
    }
    contentType = contentTypes[extname] || contentType;

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          fs.readFile("./404.html", function (error, content) {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf-8");
          });
        } else {
          res.writeHead(500);
          res.end(
            "Sorry, check with the site admin for error: " +
              error.code +
              " ..\n"
          );
          res.end();
        }
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      }
    });
  })
  .listen(port);
console.log(`Server running at http://localhost:${port}/`);
