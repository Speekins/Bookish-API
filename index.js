import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'
import { MongoClient } from 'mongodb'
import { routes } from './src/routes/bookishRoutes'
const cors = require('cors')
const uri = require ('./atlas_uri')

const corsOptions = {
  origin: ["http://localhost:3000/", "https://bookish-beta.vercel.app/"],
  optionsSuccessStatus: 200
}

const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 3001
const client = new MongoClient(uri)

app.listen(PORT, () => {
  console.log(`Your server is now running on port ${PORT}`)
})

routes(app, client)