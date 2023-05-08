import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { ObjectId } from 'mongodb'

export const routes = async (app, client) => {
  await client.connect()
  const db = client.db('bookish-db')

  app.route('/book')
    //Get all books
    .get(async (req, res, next) => {
      const books = await db.collection('books').find({}).toArray()
      res.send(books)
    })
    //Add a book
    .post(async (req, res) => {
      const newId = await db.collection('books').insertOne(req.body)
      res.status(201).json(newId)
    })

  app.route('/book/:id')
    //Get an individual book
    .get(async (req, res) => {
      const book = await db.collection('books').findOne({ _id: new ObjectId(req.params.id) })
      res.send(book)
    })

    //Edit a book
    .put((req, res) =>
      res.send('PUT request successful!')
    )

    //Delete a book
    .delete(async (req, res) => {
      const id = req.params.id

      try {
        const confirmation = await db.collection('books').deleteOne({ _id: new ObjectId(req.params.id) })
        if (confirmation.deletedCount === 0) {
          res.status(404).json({ message: `The ID ${id} does not exist.` })
        }
        res.status(200).json({ message: confirmation })
      } catch (e) {
        res.status(400).json({ message: `Failed to delete due to the following error: ${e}.` })
      }
    })

  app.route('/searchbook/:date')

    .get(async (req, res, next) => {
      let date = req.params.date

      const booksData = await fetch(
        `https://api.nytimes.com/svc/books/v3/lists/overview.json?published_date=${date}&api-key=${process.env.NYTIMES_API_KEY}`
      )
      const response = await booksData.json()
      res.send(response)
    })
}