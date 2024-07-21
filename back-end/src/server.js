import express from 'express';

let articlesInfo = [{
    name:'learn-react',
    upvotes:0,
    comments:[]
},{
    name:'learn-node',
    upvotes:0,
    comments:[]
},{
    name:'mongo',
    upvotes:0,
    comments:[]
}]


const app = express();
app.use(express.json());

app.put('/api/articles/:name/upvote', (req, res) => {
    const { name } = req.params;
    const article = articlesInfo.find(a => a.name === name);

    if(article){
        article.upvotes += 1;
        res.send(`The ${name} article now has ${article.upvotes} upvptes`);
    }
    else{
        res.send("The article does not exist");
    }

})

app.post('/api/articles/:name/comments', (req, res) => {
    const {postedBy, text} = req.body;
    const { name } = req.params;

    const article = articlesInfo.find(a => a.name === name);

    if(article){
        article.comments.push({ postedBy, text })
        res.send(article.comments)
    }
    else{
        res.send("The article does not exist");
    }
})



app.listen(8000, () => console.log('Listening on port 8000'));