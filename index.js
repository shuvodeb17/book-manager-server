const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// middle ware
app.use(cors())
app.use(express.json())




const uri = "mongodb+srv://bookManager:Tcuw4kVT2DXGzAFS@cluster0.b0yctrm.mongodb.net/?retryWrites=true&w=majority";

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
        const booksCollection = client.db('bookManager').collection('books')


        app.get('/health', (req, res) => {
            res.send('All is well')
        })

        app.post('/upload-book', async (req, res) => {
            const data = req.body;
            // console.log((data));
            const result = await booksCollection.insertOne(data)
            res.send(result)
        })

        app.get('/all-books', async (req, res) => {
            const cursor = booksCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.patch('/book/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updated = {
                $set: {
                    ...data
                }
            }
            const result = await booksCollection.updateOne(filter, updated, options)
            res.send(result)
        })

        app.delete('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await booksCollection.deleteOne(query)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Book Manager server is running on PORT: ${port}`)
})
