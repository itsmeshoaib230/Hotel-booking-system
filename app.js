const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const list=require("./models/listing.js");

main()
.then((res)=>{
    console.log("database is connected");
})
.catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set(path.join(__dirname,"Views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

let port=4515;

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Sjourney");
}

app.listen(port,()=>{
    console.log("server is running");
});



// let listing=mongoose.model("listing",ListSchema);
//index route
app.get("/listing",async (req,res)=>{
    let listingdetails = list.find({})
    res.render("home.ejs",{ listingdetails });
});

app.get("/",(req,res)=>{
    res.send("you are at root page");
});

