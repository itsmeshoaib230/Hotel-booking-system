const mongoose=require("mongoose");
const Schema=mongoose.Schema;

let ListSchema=new Schema({
    title:{
        type:String,
        required:true,
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
            default:"https://unsplash.com/photos/deer-with-fuzzy-velvet-antlers-eeq4VYT4Ueo?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink",
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
    }
});

const listing=mongoose.model("listing",ListSchema);

// module.exports={ListSchema};

module.exports=listing;