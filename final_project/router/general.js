const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");

const general = express.Router();

const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;

// Task 1
general.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2
general.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Task 3
general.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const filteredBooks = Object.keys(books)
    .filter((isbn) => books[isbn].author === author)
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found for this author." });
});

// Task 4
general.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const filteredBooks = Object.keys(books)
    .filter((isbn) => books[isbn].title === title)
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found with this title." });
});

// Task 5
general.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({ message: "No reviews found for this book." });
});

// Task 6
general.post('/register', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 10
general.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books' });
  }
});

// Task 11
general.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching book by ISBN' });
  }
});

// Task 12
general.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by author' });
  }
});

// Task 13
general.get('/async/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by title' });
  }
});

module.exports.general = general;