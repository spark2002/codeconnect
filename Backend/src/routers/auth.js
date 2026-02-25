const express = require("express");
const {validatesignupdata} = require("../utils/validatesignupdate");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();
const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/"
};

const sanitizeUser = (userDoc) => {
    const user = userDoc.toObject ? userDoc.toObject() : userDoc;
    delete user.password;
    return user;
};

router.post("/signup",async(req,res)=>{
    try{
        validatesignupdata(req);
        const {firstName, lastName, emailid, password, about, photoURL, age, gender, dateofbirth} = req.body;

        const hashpassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailid,
            password: hashpassword,
            about,
            photoURL,
            age,
            gender,
            dateofbirth
        });

        await user.save();
        const token = await user.getjwt();
        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            message: "Signup successful",
            data: sanitizeUser(user),
        });

    }catch (err) {
 
  res.status(400).send(err.message);
}
});




router.post("/login",async(req,res)=>{
    try{
    const {emailid, password} = req.body;

    const user =await User.findOne({emailid});
    if(!user){
        throw new Error("invalid credentials");
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    if(!ispasswordvalid){
        throw new Error("invalid credentials");
    }
    
    const token = await user.getjwt();

    // Session cookie: user is logged out once the browser is closed.
    res.cookie("token", token, cookieOptions);

    res.json({
        message: "Login successful",
        data: sanitizeUser(user),
    });
}catch(err){
    res.status(400).send(err.message)
    }
});





router.post("/logout", (req,res)=>{
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/"
    });
    res.send("logged out");
});


module.exports = router;
