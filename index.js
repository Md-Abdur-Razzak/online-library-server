const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookiParscer = require('cookie-parser');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(express.json());
app.use(cookiParscer())
app.use(express.json())
app.use(cors())

// -----------------varifi user Token-----------------------------

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
    // await client.connect();
   const catagoryCollection = client.db('libraryManagement').collection("catagory")
   const allBooksCollection = client.db('libraryManagement').collection("allBooks")
   const borrowCollection = client.db('libraryManagement').collection("borrowdBooks")
   const topBookCallection = client.db('libraryManagement').collection("topBook")
  //  ----------get Data ----------------------------
   app.get("/catagory",async(req,res)=>{
    const result = await catagoryCollection.find().toArray()
    res.send(result)
   })
   app.get("/topBook",async(req,res)=>{
    const result = await topBookCallection.find().toArray()
    res.send(result)
   })
   app.get("/allbooks",async(req,res)=>{
    // const bodyEmail = req.body.varifiEmail
    // const tEmail = req.user?.tokenEmail
    // if (bodyEmail !== tEmail) {
    //   return res.status(401).send({message:"authrized field"})
    // };
    // console.log(bodyEmail,tEmail);
  const result = await allBooksCollection.find().toArray()
  res.send(result)
   })
   app.get("/allbooks2",async(req,res)=>{
   const result = await allBooksCollection.find().toArray()
  res.send(result)
   })
   app.get("/borroBooks",async(req,res)=>{
    const result = await borrowCollection.find().toArray()
    res.send(result)
   })
  
   app.get("/allbooks/:id",async(req,res)=>{
    const id = req.params.id
    const qurey = {_id:new ObjectId(id)}
    const result = await allBooksCollection.findOne(qurey)
    res.send(result)
   })
   app.get("/s",async(req,res)=>{
    const email= req.query.email
    const id= req.query.id
 
    const qurey = {
      id:id,
      email:email
    }
    // console.log("ffffffff",email,id);
    const result = await borrowCollection.findOne(qurey)

    res.send(result)
   })
  //  ------------post Data-------------------
  app.post("/allbooksAdd",async(req,res)=>{
    const body = req.body
    const result = await allBooksCollection.insertOne(body)
    res.send(result)
   })
  app.post("/borrowBook",async(req,res)=>{
    const body = req.body
    const result = await borrowCollection.insertOne(body)
    res.send(result)
    const productId = (req.body.id);
    const product = await allBooksCollection.findOne({ _id:new ObjectId(productId )}); 
    if (product.quantity > 0) {
      // Decrement the quantity by 1
      product.quantity -= 1;
      // Update the product in the database
      await allBooksCollection.updateOne({ _id:new ObjectId(productId ) }, { $set: { quantity: product.quantity } });
     
    }
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
        quantity:body.quantity,
        des:body.des,
        content:body.content
      }
    }
    const result = await allBooksCollection.updateOne(qurey,filter,option)
    res.send(result)
   })
  //  ----------------delete----------------------------------------
  app.post("/return/:id",async(req,res)=>{
    const id = req.params.id
    const deletId = req.body.deletId
 
    const quantityBook = await allBooksCollection.findOne({_id:new ObjectId(deletId)})
   if(quantityBook){
    quantityBook.quantity += 1
    const d = await allBooksCollection.updateOne({_id:new ObjectId(deletId)},{ $set: { quantity:quantityBook.quantity } })

  }
   
    const qurey = {_id:new ObjectId(id)}   
  
 
    const result = await borrowCollection.deleteOne(qurey)
    res.send(result)
 
  })

  // -------------------------------jwt---------------------------------------

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