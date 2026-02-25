const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");



const userschema = new mongoose.Schema({
    firstName : {type : String, required: true, trim: true, minlength: 2, maxlength: 10},
    
    lastName : {type : String, required: true, trim: true, minlength: 2, maxlength: 10},
    
    emailid : {type : String, required: true, unique: true, lowercase: true, trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address");
            }
        }
    },
    
    about : {type : String, maxlength : 300, trim : true, default : undefined,
        validate: {
            validator: function(v){
                return v == null || v.length >= 10;
            },
            message: "About must be at least 10 characters"
        }
    },
    
    photoURL : {type : String, trim : true,
        validate(value){
            if(value && !validator.isURL(value)){
                throw new Error("Invalid Photo URL");
            }
        },
        default: "",
    },
    
    password : {type : String, required : true},
    
    age : {type : Number, min: 12, max: 100},
    
    gender : {type : String,
        enum: {
            values: ["male", "female", "others", "Male", "Female"],
            message: "{VALUE} is not valid gender",
        }
    },
    
    dateofbirth : {type : String}

},{timestamps: true});

//generate token
userschema.methods.getjwt = async function(){
    const user = this;

    const token =jwt.sign(
        {_id : user._id},
        "DEV@tinder$790",
        {expiresIn: "7d"}
    );
    return token
};

//verify password
userschema.methods.validatepassword = async function (passwordinputbyuser){
    const user = this;

    return await bcrypt.compare(passwordinputbyuser, user.password);
}




const User = mongoose.model("User", userschema);
module.exports= User;
