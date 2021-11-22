const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
    body: {
        type: String,
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    likes: {
        type: Array,
        default: () => []
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => new Date()
    }
});

const Post = mongoose.model('post', postSchema);

module.exports = Post;