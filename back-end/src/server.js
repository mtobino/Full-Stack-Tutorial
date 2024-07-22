import express from 'express';
import {MongoClient} from 'mongodb';

import { db, connectToDatabase} from "./db.js";

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const {name} = req.params;


    const article = await db.collection('articles').findOne({ name });

    if(article){
        res.json(article);
    } else {
        res.sendStatus(404);
    }
})
app.put('/api/articles/:name/upvote', async (req, res) => {
    const {name} = req.params;

    await db.collection('articles').updateOne({ name }, {
        $inc : { upvotes : 1}
    })

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article);
    } else {
        res.send("The article does not exist :P");
    }

})

app.post('/api/articles/:name/comments', async (req, res) => {
    const {postedBy, text} = req.body;
    const {name} = req.params;

    await db.collection('articles').updateOne({ name }, {
        $push: { comments : {postedBy, text} },
    })

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article)
    } else {
        res.send("The article does not exist");
    }
})


connectToDatabase(() =>{
    console.log("Connected to database");
    app.listen(8000, () => console.log('Listening on port 8000'));
})
