const validator = require("validator");

const validatesignupdata = (req)=>{
    const {firstName, lastName, emailid, password, photoURL, gender, about, age, dateofbirth} = req.body;

    if(!firstName || !lastName){
        throw new Error("firstName and lastName are required");
    }

    if(!emailid || !validator.isEmail(emailid)){
        throw new Error("Invalid email address");
    }


    if(!password || !validator.isStrongPassword(password)){
        throw new Error("password is not strong");
    }
};


const validateeditprofile = (profileData) =>{
    const allowedfields = ["firstName", "lastName", "age", "gender", "about", "photoURL", "photoUrl"];
    if (!profileData || typeof profileData !== "object") {
        return false;
    }
    const updates = Object.keys(profileData);

    return updates.every(field=> allowedfields.includes(field));
}

module.exports= {validatesignupdata,validateeditprofile};
