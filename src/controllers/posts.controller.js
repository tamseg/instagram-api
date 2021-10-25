const Post = require('../models/post');

async function create(req, res) {
    console.log(req.file);
    const { body } = req.body;
    const tempPost = {
        body,
        image: req.file.filename,
        author: req.userId
    }
    const post = new Post(tempPost);
    try {
        const savedPost = await post.save();
        res.status(201).send(savedPost);
    } catch (err) {
        console.log(err);
        res.status(400).json({message: 'Could not save the post'});
    }
}

async function getAll(req, res) {
    const allPosts = await Post.find({}).populate('author');
    res.json(allPosts);
}

module.exports = {
    create,
    getAll
}