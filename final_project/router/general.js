const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const general = express.Router();

const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;

// Task 10 - Get all books using async/await with Axios
general.get('/', async function (req, res) {
  try {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books' });
  }
});

// Task 11 - Get book details based on ISBN using async/await with Axios
general.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/`);
    const allBooks = response.data;
    const book = allBooks[isbn];

    if (book) {
      return res.status(200).json(book);
    }

    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching book by ISBN' });
  }
});

// Task 12 - Get book details based on author using async/await with Axios
general.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/`);
    const allBooks = response.data;

    const filteredBooks = Object.keys(allBooks)
      .filter((isbn) => allBooks[isbn].author === author)
      .reduce((result, isbn) => {
        result[isbn] = allBooks[isbn];
        return result;
      }, {});

    if (Object.keys(filteredBooks).length > 0) {
      return res.status(200).json(filteredBooks);
    }

    return res.status(404).json({ message: "No books found for this author." });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by author' });
  }
});

// Task 13 - Get book details based on title using async/await with Axios
general.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/`);
    const allBooks = response.data;

    const filteredBooks = Object.keys(allBooks)
      .filter((isbn) => allBooks[isbn].title === title)
      .reduce((result, isbn) => {
        result[isbn] = allBooks[isbn];
        return result;
      }, {});

    if (Object.keys(filteredBooks).length > 0) {
      return res.status(200).json(filteredBooks);
    }

    return res.status(404).json({ message: "No books found with this title." });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching books by title' });
  }
});

// Task 5 - Get book review
general.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({ message: "No reviews found for this book." });
});

// Task 6 - Register new user
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

module.exports.general = general;