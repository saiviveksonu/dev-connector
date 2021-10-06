const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    text: {
        type: String,
        requires: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "user"
        }
    }
    ],
    comments: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "user"
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now()
        }

    }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
});
module.exports=Post=mongoose.model("Post",PostSchema)