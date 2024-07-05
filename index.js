const express=require('express');
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Chat=require("./models/chats.js");
const methodOverride=require("method-override");
const ExpressError=require("./ExpressError");

main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/chatwho");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// let chat1=new Chat({
//     from:"Neha",
//     to:"Priya",
//     message:"Send me the exam sheets",
//     created_at:new Date(),
// });
// chat1.save().then((res)=>{
//     console.log(res);
// })

app.get("/",(req,res)=>{
    res.send("root working");
});

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

//INDEX ROUTE
app.get("/chats",asyncWrap(async (req,res,next)=>{
    let chats= await Chat.find();
    res.render("chat.ejs",{chats});
    
}));

//NEW ROUTE
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})

//CREATE ROUTE
app.post("/chats",asyncWrap(async(req,res,next)=>{
        let {from,to,message}=req.body;
        let newChat=new Chat({
            from: from,
            to: to,
            message: message,
            created_at: new Date(),
        })
        await newChat.save();
        res.redirect("/chats");
    
}))

//EDIT ROUTE
app.get("/chats/:id/edit",asyncWrap(async (req,res,next)=>{
        let {id}=req.params;
        let chat=await Chat.findById(id);
        if(!chat){
            next(new ExpressError(404,"Chat not found"));
        }
        res.render("edit.ejs",{chat});
    
}))

//UPDATE ROUTE
app.put("/chats/:id",asyncWrap(async(req,res,next)=>{
        let {id}=req.params;
        let {message:newMsg}=req.body;
        await Chat.findByIdAndUpdate(id,
            {message:newMsg},
            {runValidators:true},
            {new:true},
        )
        res.redirect("/chats");
}))

//DESTROY ROUTE
app.delete("/chats/:id",asyncWrap(async(req,res,next)=>{
        let {id}=req.params;
        await Chat.findByIdAndDelete(id);
        res.redirect("/chats");
    
}))

const handleValidationErr=(err)=>{
    console.log("Validation error. Please follow rules");
    return err;
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name==="ValidationError"){
        handleValidationErr(err);
    }
    next(err);
})

app.use((err,req,res,next)=>{
    let {status=500,message="Some error occurred"}=err;
    res.status(status).send(message);
})

app.listen(8080,()=>{
    console.log("listening on port 8080");
});