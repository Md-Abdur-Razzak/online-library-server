const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookiParscer = require('cookie-parser');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors())
app.use(express.json());
app.use(cookiParscer())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.wgy9amh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
   const catagoryCollection = client.db('libraryManagement').collection("catagory")
   const allBooksCollection = client.db('libraryManagement').collection("allBooks")
  //  ----------get Data ----------------------------
   app.get("/catagory",async(req,res)=>{
    const result = await catagoryCollection.find().toArray()
    res.send(result)
   })
   app.get("/allbooks",async(req,res)=>{
    const result = await allBooksCollection.find().toArray()
    res.send(result)
   })
   app.get("/allbooks/:id",async(req,res)=>{
    const id = req.params.id
    const qurey = {_id:new ObjectId(id)}
    const result = await allBooksCollection.findOne(qurey)
    res.send(result)
   })
  //  ------------post Data-------------------
  app.post("/allbooksAdd",async(req,res)=>{
    const body = req.body
    const result = await allBooksCollection.insertOne(body)
    res.send(result)
   })
  //   const {img,name,Aname,catagory,rating,_id}=updateBook
  app.post("/bookUpdate/:id",async(req,res)=>{
    const id = req.params.id 
    const body = req.body
    const qurey = {_id:new ObjectId(id)}
    const option = {upsert:true}
    const filter = {
      $set:{
        name:body.name,
        img:body.img,
        Aname:body.Aname,
        catagory:body.catagory,
        rating:body.rating
      }
    }
    const result = await allBooksCollection.updateOne(qurey,filter,option)
    res.send(result)
   })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("Labrary Browjer Ranning")
})
app.listen(port)