import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'
import { MongoClient } from 'mongodb'
import { routes } from './src/routes/bookishRoutes'

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3001
const url = `mongodb+srv://speekins:${process.env.MONGODB_PASS}@cluster0.apavkkl.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(url)

app.listen(PORT, () => {
  console.log(`Your server is now running on port ${PORT}`)
})

routes(app, client)