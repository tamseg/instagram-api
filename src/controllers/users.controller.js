const User = require('../models/user');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const mongoose = require('mongoose');

    async function create(req, res) {
        const user = new User(req.body);
        user.password = md5(user.password);
        try {
            const savedUser = await user.save();
            res.status(201).send(savedUser);
        } catch (err) {
            res.status(400).json({message: 'One of the parameters is incorrect'});
        }
    }

async function login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(403).json({message: 'One or more of the parameters are missing'});
        return;
    }
    const userExist = await User.findOne({
        username,
        password: md5(password)
    });
    if (!userExist) {
        res.status(403).json({message: 'One of the parameters is incorrect'});
        return;
    }
    
    const token = jwt.sign({id: userExist._id}, 'Tamir');

    res.json({token});
}

async function isAvailable(req, res) {
    const { username } = req.body;
    const isExisting = await User.findOne({ username });
    res.send(!isExisting);
}

async function me(req, res) {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            res.sendStatus(401);
            return;
        }
        res.send(user);
    } catch (err) {
        res.sendStatus(500);
    }
}

async function getUser(req, res) {
    try{
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            res.sendStatus(404);
        }
        else {
            res.send(user);
        }
    } catch (err) {
        res.sendStatus(500);
    }
}

async function search(req, res) {
    const { username } = req.params;
    try {
        const users = await User.find({
            username: new RegExp(username, 'ig')
        });
        res.json(users);
    } catch (e) {
        res.sendStatus(500);
    }
}

async function follow(req, res) {
    const { username } = req.params;
    const myId = req.userId;
    try {
        const whoToFollow = await User.findOne({ username });
        if (!whoToFollow) {
            res.sendStatus(400);
            return;
        }
        await User.findByIdAndUpdate(
            myId,
            { $addToSet: { following: mongoose.Types.ObjectId(whoToFollow._id) } }
        );
        res.send();
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

async function unfollow(req,res) {
    const { username } = req.params;
    const myId = req.userId;
    try {
        const whoToFollow = await User.findOne({ username });
        if (!whoToFollow) {
            res.sendStatus(400);
            return;
        }
        await User.findByIdAndUpdate(
            myId,
            { $pull: { following: mongoose.Types.ObjectId(whoToFollow._id) } }
        );
        res.send();
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    create,
    login,
    isAvailable,
    me,
    getUser,
    search,
    follow,
    unfollow
};