const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: " Unable to register user. Please provide valid username and password"});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    let listOfBooks;
    let myPromise1 = new Promise((resolve,reject) => {
        listOfBooks = JSON.stringify(books,null,4);
        resolve(listOfBooks);
    });
    myPromise1.then((result) => {
        return res.status(200).send(result);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    let booksByIsbn;
    
    let myPromise1 = new Promise((resolve,reject) => {
        booksByIsbn = books[isbn];
        resolve(booksByIsbn);
    });
    myPromise1.then((result) => {
        return res.status(200).send(result);
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
        //res.send(booksByAuthor) 
        resolve(booksByAuthor);
    });
    myPromise1.then((result) => {
        return res.status(200).send(result);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let booksByTitle = {};

    async function findBooksByTitle() {
        let myPromise = new Promise(function(resolve, reject) {        
            for (const [key, value] of Object.entries(books)) {
                if(value.title === req.params.title){
                    booksByTitle[key] = value;
                }
            } 
            resolve(booksByTitle);
        });
    return res.status(200).send(await myPromise); 
    };
    findBooksByTitle();
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews) 
    }
);

module.exports.general = public_users;
