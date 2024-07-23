import express from 'express';
import fs from 'fs'
import admin from 'firebase-admin';
import 'dotenv/config.js';
import { db, connectToDatabase} from "./db.js";
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// credentials file contains private information and should not be commited to GitHub or any file sharing service
const credentials = JSON.parse(
    fs.readFileSync('./credentials.json', 'utf8')
);

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
})

app.use(async (req, res, next) =>{
    const Authorization    = req.headers.authorization;

    if(Authorization){
        try{
            req.user = await admin.auth().verifyIdToken(Authorization);
        }catch (e) {
            return res.sendStatus(400);
        }
    }

    req.user = req.user || {};
    next();
})

app.get('/api/articles/:name', async (req, res) => {
    const {name} = req.params;
    const { uid } = req.user;
    const article = await db.collection('articles').findOne({ name });

    if(article){
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = uid && !upvoteIds.includes(uid);
        res.json(article);
    } else {
        res.sendStatus(404);
    }
})

// middleware that only the next two methods will end up using
app.use((req, res, next) =>{
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
})
app.put('/api/articles/:name/upvote', async (req, res) => {
    const {name} = req.params;
    const { uid } = req.user;

    const article = await db.collection('articles').findOne({ name });

    if(article){
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.includes(uid);

        if(canUpvote){
            await db.collection('articles').updateOne({ name }, {
                $inc : { upvotes : 1},
                $push : {upvoteIds: uid },
            });
        }
        const updatedArticle = await db.collection('articles').findOne({ name });
        res.json(updatedArticle);
    }else {
        res.send("The article does not exist :P");
    }

});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { text } = req.body;
    const { name } = req.params;
    const { email } = req.user;

    await db.collection('articles').updateOne({ name }, {
        $push: { comments : {postedBy : email, text} },
    })

    const article = await db.collection('articles').findOne({ name });

    if (article) {
        res.json(article)
    } else {
        res.send("The article does not exist");
    }
});

const PORT = process.env.PORT || 8000;

connectToDatabase(() =>{
    console.log("Connected to database");
    app.listen(PORT, () => console.log('Listening on port ' + PORT));
});
