// Modules
const path = require("path");
const express = require("express");

// Define const variables
const publicPath = path.join(__dirname, "/public");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.listen(port, () => console.log(`app is started on port ${port}...`))

