const express= require("express");
const app = express();

app.get("/user/:userid",(req,res)=>{
    console.log(req.params);
    res.send("jkgihbi");
});

app.get("/user",(req,res)=>{
    console.log(req.query);
    res.send("efe");
})

app.listen(4000, ()=>{
    console.log("in the vs code");
})