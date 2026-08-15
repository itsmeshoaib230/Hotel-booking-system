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
            type:String
        },
        url:{
            type:String,
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