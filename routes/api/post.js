const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require("../../middleware/auth")
const Post = require("../../models/post")
const User = require("../../models/User")
// this "/" is equal to the endpoint /api/post
router.post("/",
    [auth,
        [check('text', 'text is required').not().isEmpty(),
        ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select('-password')
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })
            const post = await newPost.save();
            res.json(post)
        } catch (error) {
            console.log(error)
            res.status(500).send("server error")
        }

    }
)
// get request to the api to get all the posts of all the users
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})
// get request to the api to get all the posts of the single user users
router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).sort({ date: -1 })
        if (!post) {
            res.status(400).json({ msg: "post not found" })
        }
        res.json(post)

    } catch (error) {
        console.log(error)
        if (error.kind === "ObjectId") {
            res.status(400).json({ msg: "post not found" })
        }
        res.status(500).send("server error")
    }
})
// delete request to the api to delete  the posts of the single user users by id
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // checking whether the post exists
        if (!post) {
            res.status(400).json({ msg: "post not found" })
        }
        //    check the user 
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "user is not authorised" })
        }
        // deleting the post
        await post.remove()
        res.json({ msg: "post removed" })

    } catch (error) {
        console.log(error)
        if (error.kind === "ObjectId") {
            res.status(400).json({ msg: "post not found" })
        }
        res.status(500).send("server error")
    }
})
// put the likes route
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // if the user likes the post more than once it should not be updated
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "post already liked" })
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})
// pu the likes and upsate route
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: "post has not yet been liked" })
        }
        // removing the like
        const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1)
        await post.save();
        res.json(post.likes)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")
    }
})
// setting the comment post route
router.post("/comments/:id",
    [auth,
        [check('text', 'text is required').not().isEmpty(),
        ]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select('-password')
            const post=await Post.findById(req.params.id)
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }
            post.comments.unshift(newComment)
            await post.save();
            res.json(post.comments)
        } catch (error) {
            console.log(error)
            res.status(500).send("server error")
        }

    }
)
// deleting the comment
router.delete("/comments/:id/:comments_id",auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        // get the comment from post
        const comment=post.comments.find(comment=>comment.id===req.params.comments_id)
        // check whether the comment exists
        if(!comment){
            res.status(404).json({msg:"comment not exists"})
        }
        // check user that deleting the comment is the user who made it
        if(comment.user.toString()!==req.user.id){
            res.status(401).json({msg:"user is not authorised"})
        }
        const removeIndex=post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex,1)
        await post.save();
        res.json(post.comments)
    } catch (error) {
        console.log(error)
        res.status(500).send("server error")   
    }
})
module.exports = router;