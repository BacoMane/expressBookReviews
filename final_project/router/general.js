const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromise1 = new Promise((resolve,reject) => {
    res.send(JSON.stringify(books,null,4));
    resolve("Promise 1 resolved");
  });
  myPromise1.then((successMessage) => {
    console.log("From Callback " + successMessage)
  });
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  let myPromise1 = new Promise((resolve,reject) => {
    res.send(books[isbn]);
    resolve("Promise 1 resolved");
  });
  myPromise1.then((successMessage) => {
    console.log("From Callback " + successMessage)
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    let booksByAuthor = {};
   
    let myPromise1 = new Promise((resolve,reject) => {
        for (const [key, value] of Object.entries(books)) {
            if(value.author === req.params.author){
                booksByAuthor[key] = value;
            }
        }
        
        res.send(booksByAuthor) 
        resolve("Promise 1 resolved");
      });
      myPromise1.then((successMessage) => {
        console.log("From Callback " + successMessage)
      });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let booksByTitle = {};


  let myPromise1 = new Promise((resolve,reject) => {
    for (const [key, value] of Object.entries(books)) {
        if(value.title === req.params.title){
            booksByTitle[key] = value;
        }
    }
  
    res.send(booksByTitle);
    resolve("Promise 1 resolved");
  });
  myPromise1.then((successMessage) => {
    console.log("From Callback " + successMessage)
  });

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews) });

module.exports.general = public_users;
