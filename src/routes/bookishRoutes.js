import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { ObjectId } from 'mongodb'

export const routes = async (app, client) => {
  const dbname = 'bookish-db'
  const database = client.db(dbname)
  const collection = database.collection('books')

  const connectToDatabase = async () => {
    try {
      await client.connect()
      console.log(`Connected to the ${dbname} database!`)
    } catch (err) {
      console.log(`Error connecting to the database: ${err}`)
    }
  }

  await connectToDatabase()

  app.route('/book')
    //Get all books
    .get(async (req, res, next) => {
      const books = await collection.find({ "isFavorite": "true" }).toArray()
      //res.status(200).json(books)
      res.status(200).send(books)
    })
    //Add a book
    .post(async (req, res) => {
      let newBook = req.body
      newBook = { ...newBook, "isFavorite": "true" }
      const newId = await collection.insertOne(newBook)
      res.status(201).json(newId)
    })

  app.route('/book/:id')
    //Get an individual book
    .get(async (req, res) => {
      const book = await collection.findOne({ _id: new ObjectId(req.params.id) })
      res.status(200).send(book)
    })

    //Edit a book
    .put(async (req, res) => {
      const id = req.params.id

      try {
        const confirmation = await collection.updateOne({ _id: new ObjectId(id) }, { $set: req.body })
        if (confirmation.modifiedCount === 0) {
          res.status(404).json({ message: `The ID ${id} does not exist.` })
        } else {
          res.status(200).json(confirmation)
        }
      } catch (e) {
        res.status(400).json({ message: `Failed to update due to the following error: ${e}.` })
      }
    })

    //Delete a book
    .delete(async (req, res) => {
      const id = req.params.id

      try {
        const confirmation = await collection.deleteOne({ _id: new ObjectId(req.params.id) })
        if (confirmation.deletedCount === 0) {
          res.status(404).json({ message: `The ID ${id} does not exist.` })
        }
        res.status(200).json(confirmation)
      } catch (e) {
        res.status(400).json({ message: `Failed to delete due to the following error: ${e}.` })
      }
    })

  app.route('/searchbook/:genre')
    //ex: hardcover-fiction
    .get(async (req, res) => {
      let genre = req.params.genre
      const booksData = await fetch(
        `https://api.nytimes.com/svc/books/v3/lists/current/${genre}.json?api-key=${process.env.NYTIMES_API_KEY}`
      )
      const response = await booksData.json()
      res.send(response)
    })

  app.route('/searchbook/:date/:genre')
    //lists/2019-01-20/trade-fiction-paperback.json?api-key={APIKEY}
    .get(async (req, res) => {
      let date = req.params.date
      let genre = req.params.genre

      const booksData = await fetch(
        `https://api.nytimes.com/svc/books/v3/lists/overview.json?published_date=${date}&api-key=${process.env.NYTIMES_API_KEY}`
      )
      const response = await booksData.json()
      res.send(response)
    })
}