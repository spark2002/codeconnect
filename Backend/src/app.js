require("dotenv").config();

const express = require("express");
const app = express();
const {auth, userauth} = require("./middleware/auth");
const mongoose = require("mongoose");
const User = require("./models/user");
const validateEmail = require("./utils/validators")
const {validatesignupdata} = require("./utils/validatesignupdate");
const bcrypt = require("bcrypt");
const { isJWT } = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors")

const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");


app.use(cors(
    {
        origin : "http://localhost:5173",
        credentials : true,
    }
));
app.use(express.json());
app.use(cookieParser());


app.use(authRouter);
app.use(userRouter);
app.use(profileRouter);
app.use(requestRouter);


app.get("/user",auth,(req,res)=>{
    try{
        //throw new console.error("vug");
        res.send("nooo error");
    }
    catch{
        res.status(400).send("error whyy");
    }
});

const connectdb = async ()=>{
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

/*app.post("/signup",async(req,res)=>{
    const user = new User(req.body);

    await user.save();
    console.log(res.body);
    res.send("data saved");
});*/





app.get("/datafromdb",async(req,res)=>{
    const useremail = req.body.emailid;
    const user = await User.findOne({emailid: useremail});
    res.send(user);
});

app.delete("/deleteuser",async(req,res)=>{
    const userid = req.body.userid;
    const user = await User.findByIdAndDelete(userid);
    res.send("user deleted");
});

app.patch("/updateuser", async(req,res)=>{
    const userid = req.body._id;
    const dob = req.body.dateofbirth;

    const user = await User.findByIdAndUpdate(userid,{ dateofbirth: dob });
    res.send("updated");
    console.log(req.body.dateofbirth);
});

app.patch("/updateall",async(req,res)=>{
    try{
    const userid = req.body.id;
    const updateddata = req.body;

    const allowedupdate = ["gender", "age"];

    const isupdateallowed = Object.keys(updateddata).every((key)=>
        allowedupdate.includes(key)
);
    if(!isupdateallowed){
        throw new Error("update not allowed");
    }

    const user = await User.findOneAndReplace(userid,updateddata);
} catch(err){
    res.status(400).send(err.message)
}
})



app.listen("4000", ()=>{
    console.log("inside console");
});




connectdb()
  .then(() => console.log("connected"))
  .catch((err) => console.log("not connected:", err.message));
