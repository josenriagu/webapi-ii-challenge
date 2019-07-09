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
         error: "The posts information could not be retrieved."
      });
   }
});

//get posts by id
route.get('/:id', async (req, res) => {
   const { id } = req.params;
   try {
      const posts = await Posts.findById(id);
      // posts returns an empty array if an id does not exist
      if (id && posts.length !== 0) {
         res.status(200).json(posts);
      } else {
         res.status(404).json({ message: "We found something on that id, but it disappeared into the blackHole!" })
      }
   } catch (error) {
      res.status(500).json({
         error: "The posts information could not be retrieved."
      })
   }
})

module.exports = route;
