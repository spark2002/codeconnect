const validator = require("validator");

const validateEmail = (email)=>{
    if(!validator.isEmail(email)){
        throw new Error("Invalid email format");

    }
};

module.exports = (validateEmail);