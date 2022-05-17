const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const route = require("./router/route");
const app = express();
const port = 3000;

app.use(bodyParser.json())

mongoose
  .connect(
    "mongodb+srv://saurabh042160:iafSq7ML1zCfugKI@cluster1.ymdh1.mongodb.net/group-52-Database", {
      useNewUrlParser: true,
    }
  )
  .then((result) => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

  app.use("/",route)

  app.listen(port,() => {
    console.log(`Example app listening on port ${port}`);
  });