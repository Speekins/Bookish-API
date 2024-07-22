import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { routes } from './src/routes/bookishRoutes'
const cors = require('cors')
const uri = require ('./atlas_uri')

const corsOptions = {
  origin: ["http://localhost:3000/", "https://bookish-beta.vercel.app/", "https://merry-florentine-f454e0.netlify.app"],
  optionsSuccessStatus: 200
}

const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 3001
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     const database = client.db('bookish-db');
//     const collection = database.collection('books');
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Your server is now running on port ${PORT}`)
})

routes(app, client)