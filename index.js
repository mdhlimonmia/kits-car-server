const express = require("express");
var cors = require("cors");
require("dotenv").config();
var app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const corsConfig = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
  // methods: ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
// app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pk85uor.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // client.connect();
    // Send a ping to confirm a successful connection
    const carCollection = client.db("kitsCar").collection("cars");

    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/category/:category", async (req, res) => {
      const query = {sub_category :req.params.category }
      const result = await carCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/details/:id", async (req, res) => {
      const query = {_id : new ObjectId(req.params.id) }
      const result = await carCollection.findOne(query);
      res.send(result);
    });
    app.delete("/car/:id", async (req, res) => {
      const query = {_id : new ObjectId(req.params.id) }
      const result = await carCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const query = {_id : new ObjectId(req.params.id) }
      const data= req.body
      const updateDoc = {$set: data };
      const result = await carCollection.updateOne(query, updateDoc)
      res.send(result);
    });

    app.get('/mycars', async (req, res) => {
      console.log(req.query.seller_email);
      let query = {};
      if (req.query?.seller_email) {
          query = { seller_email: req.query.seller_email }
      }
      const result = await carCollection.find(query).toArray();
      res.send(result);

      app.post('/newcar', async (req, res) => {
        const newCar = req.body;
        console.log(newCar);
        // const result = await carCollection.insertOne(newCar);
        // res.send(result);
    });

  })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
