const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


// middleWare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yq0oebc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const queryCollection = client.db('informatica').collection('queries');




        app.post('/queries', async (req, res) => {
            console.log(req.body);
            const result = await queryCollection.insertOne(req.body);
            res.send(result)
        })
        app.get('/queries/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const requestedQuery = await queryCollection.findOne(query);
            res.send(requestedQuery)
        })
        app.put('/queries/:id', async (req, res) => {
            const id = req.params.id;
            const query = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateQuery = {
                $set: {
                    productBrand: query.productBrand,
                    postedTimestamp: query.postedTimestamp,
                    productImageURL: query.productImageURL,
                    productName: query.productName,
                    boycottingReasonDetails: query.boycottingReasonDetails,
                    recommmendationCount: query.recommmendationCount,
                    queryTitle: query.queryTitle,
                    email: query.email,
                    displayName: query.displayName,
                    photoURL: query.photoURL
                }
            };
            const result = await queryCollection.updateOne(filter, updateQuery, options);
            res.send(result)
        })

        app.delete('/queries/:id', async (req, res) => {
            const result = await queryCollection.deleteOne({ _id: new ObjectId(req.params.id) })
            console.log(result);
            res.send(result)
        })



        app.get('/queries', async (req, res) => {
            let query = req.query;

            // if (req.query?.email) {
            //     query = { email: req.query.email }
            // }

            const result = await queryCollection
                .find(query)
                .sort({
                    postedTimestamp: -1
                })
                .toArray();
            res.send(result)
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('informatica running')
})

app.listen(port, () => {
    console.log(`informatica running on port ${port}`)
})