// pages/Connections.jsx
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../store/connectionSlice";
import { BASE_URL } from "../constants";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return (
      <div className="min-h-[55vh] grid place-items-center">
        <p className="text-base-content/70 text-lg">Loading connections...</p>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="min-h-[55vh] grid place-items-center">
        <h1 className="text-2xl font-semibold">No connections found</h1>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto py-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Your Connections</h1>
        <p className="text-base-content/70 mt-2">
          People you are connected with on CodeConnect.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {connections.map((user) => {
          const {
            _id,
            firstName,
            lastName,
            age,
            gender,
            about,
            photoURL,
            photoUrl,
          } = user;
          const profilePhoto =
            photoURL ||
            photoUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png";

          return (
            <article
              key={_id}
              className="bg-base-200 border border-base-300 rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={profilePhoto}
                alt={`${firstName} ${lastName}`}
                className="w-28 h-28 rounded-full object-cover mx-auto ring ring-primary/40 ring-offset-2 ring-offset-base-200"
              />

              <h2 className="text-2xl font-bold mt-5">
                {firstName} {lastName}
              </h2>

              <p className="text-base-content/70 mt-1">
                {age || "N/A"}, {gender || "N/A"}
              </p>

              <p className="text-base-content/90 mt-4 min-h-[72px] overflow-hidden">
                {about || "No bio added yet."}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Connections;
