drop table books;
CREATE TABLE books (
	id serial PRIMARY KEY,
	author VARCHAR ( 255 ) ,
	title VARCHAR ( 255 ) ,
    isbn VARCHAR(255),
    imge_url VARCHAR(255),
    description VARCHAR
);

CREATE TABLE AUTHORS (id SERIAL PRIMARY KEY, name VARCHAR(255));
ALTER TABLE books ADD CONSTRAINT fk_authors FOREIGN KEY (author_id) REFERENCES authors(id);
