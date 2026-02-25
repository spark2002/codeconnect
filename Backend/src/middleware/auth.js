const jwt = require("jsonwebtoken");
const User = require("../models/user");


const auth = (req,res,next)=>{
    const name = "abhishek";
    const auth = name === "abhishek";

    if (!auth){
       return res.status(401).send("not authorized");
    }
    
        next();
    
};

const userauth = async(req,res,next)=>{
    try{
    const {token} = req.cookies;
    if(!token){
        throw new Error("token is missing");
    }

    const decoded = jwt.verify(token, "DEV@tinder$790");
    const {_id}=decoded;

    const user = await User.findById(_id);
    if(!user){
        throw new Error("user dosnt exist");
    }

    req.user = user;

    next()
}   catch(err){
    res.status(401).json({ error: err.message });

}
};

module.exports = {auth, userauth}






