'use strict';

const PORT = 3000;

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);

client.connect().then(() => {
    console.log('It\'s running');
});

// Application Middleware
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
function Book(obj) {
    console.log(obj.industryIdentifiers ? obj.industryIdentifiers[0].identifier: 'kdkdk');
    // console.log(obj.imageLinks ? obj.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg');
    this.img = obj.imageLinks ? obj.imageLinks.thumbnail.replace('http', 'https') : 'https://i.imgur.com/J5LVHEL.jpg',
        this.title = obj.title,
        this.author = obj.authors,
        this.description = obj.description || 'there is No description about this book yet !!',
        this.isbn = obj.industryIdentifiers ? obj.industryIdentifiers[0].identifier: 'No isbn'

    }
//home page reatrive all data form Db done 
app.get('/', (req, res) => {
    let sql = 'SELECT * FROM books';
    client.query(sql).then((result)=>{
        // console.log(result.rowCount);
        res.render('pages/index',{result:result.rows,count:result.rowCount});
    })
});

//part  2 select specific one 
app.get('/books/:id',(req,res)=>{
    let sql = `SELECT * FROM books WHERE id=$1`
    client.query(sql,[req.params.id]).then(result=>{
        res.render('pages/books/deatils',{data:result.rows[0]});
    }).catch(err=>console.log('Error While Retrieving the book',err))
});

app.get('/search/new', (req, res) => res.render('pages/searches/new'));

app.post('/searches', createSearch);



app.post('/addFav', (req, res) => {
    let sql = `INSERT INTO books (author,title,isbn,imge_url,description) VALUES ($1,$2,$3,$4,$5) RETURNING * `;
    let values = [req.body.author, req.body.title, req.body.isbn, req.body.imge_url, req.body.description];
    
    client.query(sql, values).then((result) => {
    }).catch(err=>console.log('ERROR'));
    res.redirect('/');
})


function createSearch(request, response) {
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';
    if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
    if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }
    superagent.get(url)
        .then(apiResponse => {
            return apiResponse.body.items
                .map(bookResult => {
                    return new Book(bookResult.volumeInfo)
                })
        })
        .then(results => response.render('pages/searches/show', { searchResults: results }))
}


app.listen(process.env.PORT || PORT, () => console.log(`Server Run at port : ${PORT}`))