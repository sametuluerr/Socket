const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Please use your Mongodb URI
// For More Information: https://www.mongodb.com/cloud/atlas
const uri = "mongodb+srv://<username>:<password>@cluster0.erzry.mongodb.net/test";
const MongoClient = require("mongodb").MongoClient;

const mongoClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

io.on("connection", (socket) => {
  console.log("a user connected");
  mongoClient.connect().then((db) => {
    db.db("logdb").collection("log").find().sort({ _id: -1 }).limit(20).toArray(function (err, result) {
        if (err) throw err;
        io.emit("livedata", result);
      });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
});

mongoClient.connect().then((db) => {
  const changeStream = mongoClient.db("logdb").collection("log").watch();
  changeStream.on("change", (next) => {
    db.db("logdb").collection("log").find().sort({_id:-1}).limit(1).toArray(function(err, result) {
      if (err) throw err;
      io.emit("livedata", result);
    });
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
