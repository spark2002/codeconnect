// pages/Feed.jsx
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../store/feedSlice";
import UserCard from "../components/UserCard";
import { BASE_URL } from "../constants";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const handleRequestSent = (userId) => {
    dispatch(removeUserFromFeed(userId));
  };

  useEffect(() => {
    const getFeed = async () => {
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res.data.data));
      } catch (err) {
        console.error(err);
      }
    };

    if (!feed) getFeed();
  }, [dispatch, feed]);

  if (!feed) {
    return (
      <div className="min-h-[55vh] grid place-items-center">
        <p className="text-base-content/70">Loading feed...</p>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="min-h-[55vh] grid place-items-center">
        <h1 className="text-xl font-semibold">No users found</h1>
      </div>
    );
  }

return (
  <section className="w-full min-h-[80vh] flex flex-col items-center justify-center">

    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold">Discover Developers</h1>
      <p className="text-base-content/70 mt-2">
        Send connection requests to people you want to collaborate with.
      </p>
    </div>

    <div className="flex justify-center items-center w-full">
      {feed.length > 0 && (
        <UserCard user={feed[0]} onAccept onRequestSent={handleRequestSent} />
      )}
    </div>

  </section>
);
};

export default Feed;
