const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");

const { userauth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionrequest");

const USER_SAFE_DATA =
  "firstName lastName photoURL age gender about";



/**
 * GET received connection requests
 */
userRouter.get(
  "/user/requests/received",
  userauth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId", USER_SAFE_DATA);

      res.json({
        message: "Data fetched successfully",
        data: connectionRequests,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);





/**
 * GET accepted connections
 */
userRouter.get(
  "/user/connections",
  userauth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connections = await ConnectionRequest.find({
        status: "accepted",
        $or: [
          { fromUserId: loggedInUser._id },
          { toUserId: loggedInUser._id },
        ],
      })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

      const data = connections.map((row) => {
        if (
          row.fromUserId._id.toString() ===
          loggedInUser._id.toString()
        ) {
          return row.toUserId;
        }
        return row.fromUserId;
      });

      res.json({ data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);







userRouter.get("/feed", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Protect server from heavy load
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    // Find all connection requests where logged-in user is involved
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    // Store users to hide
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Fetch users excluding hidden + self
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Feed fetched successfully",
      page,
      limit,
      data: users
    });

  } catch (err) {
    res.status(400).json({
      message: "Error fetching feed",
      error: err.message
    });
  }
});


module.exports = userRouter;
