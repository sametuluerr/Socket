const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const dotenv = require("dotenv");
const MongoClient = require("mongodb").MongoClient;

// Environment Variables
dotenv.config({
  path: "./config/env/config.env",
});

const { MONGO_URI, DB_NAME, COLLECTION_NAME } = process.env;

const mongoClient = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

io.on("connection", (socket) => {
  mongoClient.connect().then((db) => {
    getRecords(db, 20);
  });
});

mongoClient.connect().then((db) => {
  const changeStream = mongoClient
    .db(DB_NAME)
    .collection(COLLECTION_NAME)
    .watch();
  changeStream.on("change", (next) => {
    getRecords(db, 1);
  });
});

getRecords = (db, recordCount) => {
  db.db(DB_NAME)
    .collection(COLLECTION_NAME)
    .find()
    .sort({ _id: -1 })
    .limit(recordCount)
    .toArray(function (err, result) {
      if (err) throw err;
      io.emit("livedata", result);
    });
};

http.listen(3000, () => {
  console.log("listening on *:3000");
});
