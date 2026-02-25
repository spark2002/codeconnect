const mongoose = require("mongoose");

const connectionrequestschema = new mongoose.Schema(
    {
        fromUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User",
        },
        toUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User",
        },
        status : {
            type : String,
            required : true,
            enum : {
                values : ["ignored", "interested", "accepted", "rejected"],
                message : "{VALUE} is an incorrect status type",
            },
        },
    },
    {
        timestamps : true,
    }
);


// connectionrequest.js

// ... (schema definition)

// Change this block:
connectionrequestschema.pre("save", function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

// IMPORTANT: Ensure your model name is capitalized (convention) 
// to avoid confusion with internal variables
const ConnectionRequest = mongoose.model(
    "ConnectionRequest",
    connectionrequestschema
);

module.exports = ConnectionRequest;
