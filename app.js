const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const list=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

main()
.then((res)=>{
    console.log("database is connected");
})
.catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

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
    const listingdetails = await list.find({});
    res.render("./listings/home.ejs",{ listingdetails });
});

app.get("/listing/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

app.post("/listing/new",async (req,res)=>{
    let{title:t,description:d,image:i,price:p,location:l,country:c}=req.body.listing;
    const listt=new list(req.body.listing);
    await listt.save();
    // console.log(listt);
    res.redirect("/listing");
});

app.get("/listing/:id",async (req,res)=>{
    let{id}=req.params;
    const particularlist=await list.findById(id);
    res.render("./listings/idbased.ejs",{ particularlist });
});

app.get("/listing/:id/edit",async (req,res)=>{
    let{id}=req.params;
    const obj=await list.findById(id);
    res.render("./listings/edit.ejs",{obj});

});

app.put("/listing/:id/edit",async (req,res)=>{
    let{id}=req.params;
    let{title,description,image,price:p,location:l,country:c}=req.body.listing;
    const lisst=await list.findByIdAndUpdate(id, {title:title,description:description,image:image,price:p,location:l,country:c});
    res.redirect("/listing");
});

app.delete("/listing/:id/delete",async (req,res)=>{
    let{id}=req.params;
    await list.findByIdAndDelete(id);
    res.redirect("/listing");
});

app.get("/",(req,res)=>{
    res.send("you are at root page");
});

