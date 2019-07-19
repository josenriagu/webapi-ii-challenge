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

// get comments by id
route.get('/:id/comments', async (req, res) => {
   const { id } = req.params;
   try {
      const posts = await Posts.findById(id);
      if (id && posts.length !== 0) {
         const comments = await Posts.findPostComments(id)
         res.status(200).json(comments);
      } else {
         res.status(404).json({ message: "We found something on that id, but it disappeared into the blackHole!" })
      }
   } catch (error) {
      res.status(500).json({
         error: "The posts information could not be retrieved."
      })
   }
})

// create a new post
route.post('/', async (req, res) => {
   try {
      const { title, contents } = req.body;
      if (title && contents) {
         const newPostId = await Posts.insert(req.body)
         const post = await Posts.findById(newPostId.id)
         res.status(201).json({ post })
      } else {
         res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
         })
      }
   } catch {
      res.status(500).json({
         error: "There was an error while saving the post to the database"
      })
   }
})

// create a new comment to a post
route.post('/:id/comments', async (req, res) => {
   try {
      const { id } = req.params;
      const posts = await Posts.findById(id);
      if (id && posts.length !== 0) {
         const { text } = req.body;
         if (text) {
            const newCommentId = await Posts.insertComment({ ...req.body, post_id: id })
            const comment = await Posts.findCommentById(newCommentId.id)
            res.status(201).json({ comment })
         } else {
            res.status(400).json({
               errorMessage: "Please provide text for the comment."
            })
         }
      } else {
         res.status(404).json({
            message: "The post with the specified ID does not exist."
         })
      }
   } catch {
      res.status(500).json({
         error: "There was an error while saving the post to the database"
      })
   }
})

// edit a post
route.put('/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const posts = await Posts.findById(id);
      if (id && posts.length !== 0) {
         const { title, contents } = req.body;
         if (title && contents) {
            const updatedPostId = await Posts.update(id, req.body);
            const updatedPost = await Posts.findById(id);
            res.status(200).json(updatedPost)
         } else {
            res.status(400).json({
               errorMessage: "Please provide title and contents for the post."
            })
         }
      } else {
         res.status(404).json({
            message: "The post with the specified ID does not exist."
         })
      }
   } catch {
      res.status(500).json({
         error: "There was an error while saving the post to the database"
      })
   }
})

// delete a post
route.delete('/:id', async (req, res) => {
   try {
      const { id } = req.params;
      const posts = await Posts.findById(id);
      if (id && posts.length !== 0) {
         const RemovedPost = await Posts.remove(id);
         // find remaining posts and send back as reponse
         const posts = await Posts.find()
         res.status(200).json({ posts })
      } else {
         res.status(404).json({
            message: "The post with the specified ID does not exist."
         })
      }
   }
   catch {
      res.status(500).json({
         error: "There was an error while saving the post to the database"
      })
   }
})

module.exports = route;
