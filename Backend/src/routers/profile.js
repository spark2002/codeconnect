const express = require("express");
const { userauth } = require("../middleware/auth");
const { validateeditprofile } = require("../utils/validatesignupdate");

const router = express.Router();

const sanitizeUser = (userDoc) => {
    const user = userDoc.toObject ? userDoc.toObject() : userDoc;
    delete user.password;
    return user;
};

router.get("/profile/view",userauth,async(req,res)=>{
    try{
    res.json({
        message: "Profile fetched successfully",
        data: sanitizeUser(req.user),
    });
    }
    catch(err){
        res.status(400).send(err.message);
    }
});




router.patch("/profile/edit",userauth,async(req,res)=>{
    try{
        if(!validateeditprofile(req.body)){
            throw new Error("invalid edit fields");
        }

        const user = req.user;

        Object.keys(req.body).forEach(key=>{
            user[key] = req.body[key];
        });

        await user.save();
        res.json({
            message: "Profile updated successfully",
            data: sanitizeUser(user),
        });

    }
    catch(err){
        res.status(400).send(err.message)
    }
});


module.exports = router;


