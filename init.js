const mongoose=require("mongoose");
const Chat=require("./models/chats.js");
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

let chats=[
    {
        from:"Tanmay",
        to:"Parin",
        message:"Send me the CV",
        created_at:new Date(),
    },
    {
        from:"Riya",
        to:"Shanti",
        message:"Hi, how are you?",
        created_at:new Date(),
    },
    {
        from:"Khushi",
        to:"Ram",
        message:"Make some good web development projects",
        created_at:new Date(),
    }
];

Chat.insertMany(chats);