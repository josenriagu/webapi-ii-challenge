// import express
const express = require('express');
// link up the database script
const Posts = require('./db');
// initialize express router to a variable
const route = express.Router();

// get all posts
route.get('/', async (req, res) => {
   try {
      const posts = await Posts.find(req.query);
      res.status(200).json(posts);
   } catch (error) {
      // log error to database
      console.log(error);
      res.status(500).json({
         message: 'Error retrieving the posts',
      });
   }
});

module.exports = route;
