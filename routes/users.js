const mongoose = require("mongoose");
const router = require("express").Router();

// import middleware (?)
// const authMiddleware = require("../middleware/authMiddleware");
// router.use(authMiddleware); 

// import Models
const userSchema = require("../models/User");
const chatSchema = require("../models/Chat");
const messageSchema = require("../models/Message");

// GET user by Id
router.route("/:userId").get(async (req, res, next) => {
    const { userId } = req.params;
   
    await userSchema
        .findById(userId, "_id username")
        .then(user => {
            res.json({ user });
        })
        .catch(err => {
            console.log("Contacts Error " + err);
            return next(err);
        });
});

// GET user contacts
router.route("/:userId/contacts").get(async (req, res, next) => {
    const { userId } = req.params;
    
    await userSchema
        .find({ _id: { $ne: userId } }, "_id username")
        .then(users => {
            res.json({ users });
        })
        .catch(err => {
            console.log("Contacts Error " + err);
            return next(err);
        });
});

// GET messages
router.route("/messages/:chatId").get(async (req, res, next) => {
    await messageSchema
        .find({ chatId: req.params.chatId})
        .then(messages => {
            res.json({ messages });
        })
        .catch(err => {
            console.log("Get Messages Error " + err);
        });
});

// POST new message
router.route("/message").post(async (req, res, next) => {
    await messageSchema
        .create(req.body)
        .then(message => {
            res.json({ message });
        })
        .catch(err => {
            console.log("New Message Error " + err);
        });
});

// POST new chat
router.route("/:userId/chat").post(async (req, res, next) => {
    let chatName = "";
    if (req.body.name) {
        chatName = req.body.name;
    }

    await chatSchema
        .create({
            name: chatName,
            members: [req.params.userId, ...req.body.members],
            type: req.body.type,
        })
        .then(chat => {
            res.json({ chat });
        })
        .catch(err => {
            console.log("New Chat Error " + err);
        });
});

// GET user's chats
router.route("/:userId/chat/:chatType").get(async (req, res, next) => {
    await chatSchema
        .find({ type: req.params.chatType, members: { $in: [req.params.userId] } })
        .then(chats => {
            res.json({ chats });
        })
        .catch(err => {
            console.log("Get Chats Error " + err);
        });
});

// GET private chat w/ two user's IDs
router.route("/chat/:firstUserId/:secondUserId").get(async (req, res, next) => {
    await chatSchema 
        .findOne({ type: "private", members: { $all: [req.params.firstUserId, req.params.secondUserId] } })
        .then(chat => {
            res.json({ chat });
        })
        .catch(err => {
            console.log("Get Chats Error " + err);
        });
});

// GET chat room by roomId
router.route("/chat/:roomId").get(async (req, res, next) => {
    await chatSchema 
        .findById(req.params.roomId)
        .then(chat => {
            res.json({ chat });
        })
        .catch(err => {
            return next(err);
        });
});

module.exports = router;