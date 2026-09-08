const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRoutes=require("./routes/listing.js");
const reviewRoutes=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local"); 
const User=require("./models/user.js"); 
const userRoutes=require("./routes/user.js");


// pbkdf2 hashing algo is used

const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main()
.then((res)=>{
    console.log("database is connected");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Sjourney");
}


let port=4515;

app.listen(port,()=>{
    console.log("server is running");
});

app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({
        email:"skshoaib7092@gmail.com",
        username:"shoaib923"
    });

    let registeredUser=await User.register(fakeuser,"shoaibf123");
    res.send(registeredUser);
});

app.use((req,res,next)=>{
    res.locals.suc=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

//listing routes
app.use("/listing", listingRoutes);
//review routes
app.use("/listing/:id", reviewRoutes);
//user routes
app.use("/", userRoutes)
//root page
app.get("/",(req,res)=>{
    res.send("you are at root page");
});

//to handle error routes
app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

// middleware to handle errors
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.render("error.ejs",{message});
});

