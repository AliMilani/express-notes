const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

const dbUri = process.env.DB_URI;

mongoose
    .connect(dbUri)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));


let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}...`));