/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// Code is uitgelegd in de Wiki bij onderdeel: Databse-structure

// NPM packages
const express = require("express");

const dotenv = require("dotenv").config();

const { MongoClient } = require("mongodb");
const { ObjectId } =   require("mongodb");

// Site laten werken
const app = express();
const port = process.env.PORT || 3000;

let db = null;

// Dit heb je nodig om data te posten
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public, View
app.use(express.static("public"));
app.set("view engine", "ejs");

// Pages
app.get("/", async (req, res) => {
  const users = await db.collection("users").find({},{}).toArray();
  const tmdb = await db.collection("tmdb").find({},{}).toArray();

  console.log(tmdb)

  res.render("pages/index", {
    users,
    tmdb
  });
});

app.get("/mylist/:userId/:slug", async (req, res) => {
  const query = {_id: ObjectId(req.params.userId)};
  const user = await db.collection("users").findOne(query);
  const tmdb = await db.collection("tmdb").find({},{}).toArray();
  const kdramaId = {_id: ObjectId(req.params.kdramaId)};

  res.render('pages/mylist', {
    user,
    tmdb
  })
}); 

app.post("/mylist/:userId/:slug", async (req, res) => {
  const query = {_id: ObjectId(req.params.userId)};
  const kdramaId = {_id: ObjectId(req.body.mylist)};
  const updateQuery = {$push: {mylist: req.body.kdramaId}}
  await db.collection("users").updateOne(query, updateQuery);

  const url = `/mylist/${req.params.userId}/${req.params.slug}`;
  res.redirect(url);
  console.log(url);
});

app.post("/profile/:userId/:slug", async (req, res) => {
  const query = {_id: ObjectId(req.params.userId)};
  const user = await db.collection("users").findOne(query);
  const filteredList = user.mylist.filter(kdrama => kdrama !== req.body.kdramaId)
  const updateQuery = { $set: { mylist: filteredList } }
  await db.collection('users').updateOne(query, updateQuery)

  const url = `/profile/${req.params.userId}/${req.params.slug}`;
  res.redirect(url);
});

app.get("/profile/:userId/:slug", async (req, res) => {
  const query = {_id: ObjectId(req.params.userId)};
  const kdramaId = {_id: ObjectId(req.body.mylist)};
  const user = await db.collection("users").findOne(query);
  const tmdb = await db.collection("tmdb").find({},{}).toArray();
  const userKdrama = tmdb.filter(kdrama => user.mylist.includes(String(kdrama._id)))

  res.render("pages/profile", {
    user,
    tmdb,
    userKdrama
  });
});

app.get("/kdrama/:kdramaId/:slug/:userId/:slug", async (req, res) => {
  const query = {_id: ObjectId(req.params.userId)};
  const kdramaId = {_id: ObjectId(req.params.kdramaId)};
  const user = await db.collection("users").findOne(query);
  const tmdb = await db.collection("tmdb").findOne(kdramaId);

  res.render("pages/detail", {
    user,
    tmdb,
  });
});

// 404
app.use( async (req, res) => {
  console.error("Error 404: page nog found");
  const tmdb = await db.collection("tmdb").find({},{}).toArray();

  res.status(404).render("pages/404", {
    tmdb
  });
});

// Make connection with Mongo
async function connectDB() {
  const uri = process.env.DB_URI;
  const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });
  try {
      await client.connect();
      db = client.db(process.env.DB_NAME);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  connectDB()
  .then(console.log("We have a connection to mongo"));
});
