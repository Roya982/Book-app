'use strict';

const PORT = 3000;

const express = require('express');
const superagent = require('superagent');

const app = express();

// Application Middleware
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

function Book(obj) {
    this.img ='https://i.imgur.com/J5LVHEL.jpg'|| obj.imageLinks.smallThumbnail,
        this.title = obj.title,
        this.author = obj.authors,
        this.description = obj.description || 'there is No description about this book yet !!'
}

app.get('/welcome', (req, res) => {
    res.render('pages/index');
});

app.get('/search/new', (req, res) => res.render('pages/searches/new'));

app.post('/searches', createSearch);


function createSearch(request, response) {
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';

    console.log(request.body);
    console.log(request.body.search);

    if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
    if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }

    superagent.get(url)
        .then(apiResponse => {
            console.log(apiResponse.body.items);
            return apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo))
        })
        .then(results => response.render('pages/searches/show', { searchResults: results }))
}










app.listen(process.env.PORT || PORT, () => console.log(`Server Run at port : ${PORT}`))