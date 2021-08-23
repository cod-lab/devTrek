const express = require('express');
// const mongoose = require('mongoose');
// const fs = require('fs').promises;
const methodOverride = require('method-override');

const articleRoute = require('./routes/articles');
const { readController } = require('./controllers/articles');

const app = express();

app.set('view engine','ejs');

app.use(express.urlencoded({ extended: "false" }));     // parse data sent thru html form
app.use(express.json({ limit: "1mb" }));        // parse json data coming from frontend
app.use(methodOverride('_method'));

app.get(/^\/(home)*$/, (_, res) => readController(res,null,'index')

    // {
        /*const articles = [{
            title: 'article1',
            createdAt: new Date().toLocaleDateString(),
            description: 'article1 description'
        },
        {
            title: 'article2',
            createdAt: new Date().toLocaleDateString(),
            description: 'article2 description'
        }];*/
        // let articles = [];

        /*try {
            const response = await fs.readFile('db.json','utf8'); // || '[]';
            if(response) {
                const articles = JSON.parse(response);
                // console.log(articles);
                articles.sort((a,b) => b.id - a.id);    // sort objects inside array in descending order of articles[i].id
                // console.log(articles);
                res.render('articles/index', { articles });        // calling view pg
            }
        } catch (err) {
            console.log('err ->',err);
            res.send(err);
        }
    }*/
);

app.use('/articles',articleRoute);

app.use(express.static('views/assets'));    // for creating link for external style and script files to link in ejs files

app.all('*', (_,res) => res.send('<br><h2><center>404!<br>Page not found...</center></h2>'));

// const [host, port] = ['localhost', process.env.PORT || 5000];
const { HOST:host='localhost', PORT:port=5000 } = process.env;
// app.listen(port).then(console.log(`Connection is established at http://${host}:${port}`));
app.listen(port, () => console.log(`Connection is established at http://${host}:${port}`));
// mongoose.connect('mongodb://localhost/blog',
    // {
        // useNewUrlParser: true,
        // useUnifiedTopology: true
    // })
    // .then(app.listen(port, () => console.log(`Connection is established at http://${host}:${port}`)))
    // .then(() => {
    //     app.listen(port);
    //     console.log(`Connection is established at http://${host}:${port}`);
    // })
    // .catch(err => console.log(err));

