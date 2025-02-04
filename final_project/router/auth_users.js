const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
} 

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
}});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let sessionUsername = req.session.authorization['username'];
    //return res.status(208).json({message: "session username is _$sessionUserName"+sessionUserName});
    const isbn = req.params.isbn;
    if(Object.keys(req.params).length !== 0){
        //return res.status(208).json(req.body);

    if(books[isbn].reviews){
        let userReviewExist = false;
        //let keys ="";
        for (const [key, value] of Object.entries(books[isbn].reviews)) {
            //keys += " " + key;
            if(key === sessionUsername){
                userReviewExist = true;
            }
        }
        //res.send(keys+" "+req.body.username);

        if(!userReviewExist){
            books[isbn].reviews[sessionUsername] = req.params.review;
            return res.status(200).json({message: "Review added succesfully for book with isbn: "+isbn+" by user: "+sessionUsername});
        }else{
            books[isbn].reviews[sessionUsername] = req.params.review;
            return res.status(200).json({message: "Review updated succesfully for book with isbn: "+isbn+" by user: "+sessionUsername});
        }
    }else{
        return res.status(208).json({message: "Invalid review."});
    }
    }else{  
        return res.status(208).json({message: "Invalid review."});
    }

});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let sessionUsername = req.session.authorization['username'];
    //return res.status(208).json({message: "session username is _$sessionUserName"+sessionUserName});
    const isbn = req.params.isbn;
    //if(Object.keys(req.body).length !== 0){
        //return res.status(208).json(req.body);

    if(books[isbn].reviews){
        let userReviewExist = false;
        //let keys ="";
        for (const [key, value] of Object.entries(books[isbn].reviews)) {
            //keys += " " + key;
            if(key === sessionUsername){
                userReviewExist = true;
            }
        }
        //res.send(keys+" "+req.body.username);

        if(!userReviewExist){
            //books[isbn].reviews[sessionUsername] = req.body.review;
            return res.status(208).json({message: "No reviews found!"});
        }else{
            delete books[isbn].reviews[sessionUsername];
            return res.status(200).json({message: "Review deleted succesfully by: "+sessionUsername+" for book: " +isbn});
        }
    }else{
        return res.status(208).json({message: "Invalid review."});
    }
    

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
