const mongoose=require("mongoose");
const listdata=require("./data.js");
const list=require("../models/listing.js");


main()
.then((res)=>{
    console.log("database connected");
})
.catch((err)=>{
    console.log(err);
});


let MONGO_URI="mongodb://127.0.0.1:27017/Sjourney";

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Sjourney");
}

const initdb=async ()=>{
    await list.deleteMany({});
    await list.insertMany(listdata.data);
    console.log("data saved");

};

initdb();