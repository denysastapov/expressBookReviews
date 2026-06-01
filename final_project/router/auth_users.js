const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check if username is available for registration
const isValid = (username) => {
  const matchedUser = users.find((user) => user.username === username);
  return matchedUser ? false : true;
};

// Check if username/password pair is valid
const authenticatedUser = (username, password) => {
  const matchedUser = users.find(
    (user) => user.username === username && user.password === password
  );
  return matchedUser ? true : false;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }

  const accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).json({
    message: "User successfully logged in",
    accessToken: accessToken,
  });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review || req.body.review;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  const username =
    req.session.authorization.username || req.user?.data;

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
    book: books[isbn],
  });
});

// Delete a book review added by the logged-in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const username =
    req.session.authorization.username || req.user?.data;

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review successfully deleted",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;