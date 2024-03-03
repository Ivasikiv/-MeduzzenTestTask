const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const uploadController = require("./controllers/uploadController");

const app = express();

app.use(bodyParser.json());
app.use(fileUpload());

app.post("/upload", uploadController.uploadFile);

module.exports = app;
