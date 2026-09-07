const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

let ListSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        filename:{
            type:String,
            default:"default image"
        },
        url:{
            type:String,
            default:
        "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9vbCUyMHJlc29ydHxlbnwwfHwwfHx8MA%3D%3D",
        }
    },
    price:{
        type:Number,
        default:"",
        
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

ListSchema.post("findOneAndDelete", async(list)=>{
    if(list){
        await Review.deleteMany({_id:{$in: list.review}});
    }
})

const listing=mongoose.model("listing",ListSchema);

// module.exports={ListSchema};

module.exports=listing;