const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

// router.get('/', (req, res) => {
//   const sql = db.select('*').from('posts').toString();
//   console.log(sql);
//   db.select('*').from('posts')                             // this is the same as the bottom one this uses the * and also uses .select and .from that is SQL
//   .then(posts => {
//     res.json(posts)
//   })
//   .catch(err => {
//     res.status(500).json({message: 'error getting posts', error:err})
//   })
// });

// router.get('/', (req, res) => {

  // const sql = db('posts').toString();                  // This is to console log the SQL statement in this case it would be select * from 'posts'
  // console.log(sql);

//   db('posts')
//   .then(posts => {                                              // This is the same as the above method but it does not use .select or .from the db('posts') defaults to .select and .from
//     res.json(posts)
//   })
//   .catch(err => {
//     res.status(500).json({message: 'error getting posts', error:err})
//   })
// });

router.get('/', async (req, res) => {
  try {
    const posts = await db('posts');
    res.json(posts)
  }
  catch (err) {
    res.status(500).json({message: 'error getting posts', error:err});
  }
 
});

router.get('/:id', async (req, res) => { 

  const {id} = req.params;

  try {

    const [post] = await db('posts').where({id});

    if (post) {
      res.json(post);

    } else {

      res.status(404).json({message: 'bad id'});
    }

  } catch (error) {
    res.status(500).json({message: 'db error', error: err});
  }
});

router.post('/', async (req, res) => {
  const newPost = req.body;

  try {
    // const sql =  db('posts').insert(newPost).toString();                               // This is to console log the SQL raw statement 
    // console.log(sql);

    const post = await db('posts').insert(newPost);
    res.status(201).json(post)

  } catch (error) {
    res.status(500).json({message: 'db not inserted', error: err});
  }
});

router.put('/:id', async (req, res) => {
  const {id} =  req.params;
  const changes = req.body

  try {
    const count = await db('posts').update(changes).where({id});

    if (count) {
      res.json({updated: count});
    } else {
      res.status(404).status({message: 'invalid id'})
    }
  } catch (error) {
    console.log(err);
    res.status(500).json({message: 'error updating record', error: err})
  }

});

router.delete('/:id', async (req, res) => {
  const {id} = req.params;

  try {
    const count = await db('posts').where({id}).del();
    if (count) {
      res.json({deleted: count})
    } else {
      res.status(404).json({message: 'invalid id'})
    }
  } catch (error) {
    res.status(500).json({message: 'error deleting record', error: err})
  }
});

module.exports = router;