const express = require('express');
const path = require("path");

const bodyParser = require("body-parser");

var app = express();
const http = require('http').createServer(app);

const PORT_OPTION_NO = 2;
const PORT = process.argv[PORT_OPTION_NO] ? process.argv[PORT_OPTION_NO] : 8090;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/js', express.static(path.join(__dirname, 'js'))); //serving static files
app.use('/styles', express.static(path.join(__dirname, 'styles'))); //serving static files
app.use('/data', express.static(path.join(__dirname, 'data'))); //serving static files
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.get("/get_ticker/:ticker", function (req, res) {
    
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

http.listen(PORT, function () {
    console.log("serving at port :" + PORT);
});