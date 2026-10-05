if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

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
const {MongoStore}=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local"); 
const User=require("./models/user.js"); 
const list=require("./models/listing.js");
const userRoutes=require("./routes/user.js");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const dbUrl=process.env.ATLAS_DB;

// pbkdf2 hashing algo is used
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR AT MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
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
    await mongoose.connect(dbUrl);
}

let port=4515;

app.listen(port,()=>{
    console.log("server is running");
});

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"skshoaib7092@gmail.com",
//         username:"shoaib923"
//     });

//     let registeredUser=await User.register(fakeuser,"shoaibf123");
//     res.send(registeredUser);
// });

app.use((req,res,next)=>{
    res.locals.suc=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.logpage=req.user;
    next();
});

app.get("/",async(req,res)=>{
   const listingdetails = await list.find({});
   res.render("./listings/home.ejs",{ listingdetails });
});
//listing routes
app.use("/listing", listingRoutes);
//review routes
app.use("/listing/:id", reviewRoutes);
//user routes
app.use("/", userRoutes)
//root page
// 


//to handle error routes
app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

// middleware to handle errors
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("errorPage", { message });
});
