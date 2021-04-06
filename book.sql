  
drop table books;
CREATE TABLE books (
	id serial PRIMARY KEY,
	author VARCHAR ( 255 ) ,
	title VARCHAR ( 255 ) ,
    isbn VARCHAR(255),
    imge_url VARCHAR(255),
    description text
);