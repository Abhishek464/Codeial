const mongoose=require('mongoose');

const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    // include the array of id of all comments in this post
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likes:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'like'
    }
    ]
},{
    timestamps:true
});

const Post=mongoose.model('Post',postSchema);
module.exports=Post;