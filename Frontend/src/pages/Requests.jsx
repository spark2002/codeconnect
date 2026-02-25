// pages/Requests.jsx

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../store/requestSlice";
import { BASE_URL } from "../constants";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [error, setError] = useState("");

  // Fetch all received requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        BASE_URL + "/user/requests/received",
        { withCredentials: true }
      );

      dispatch(addRequests(res.data.data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
    }
  };

  // Accept or Reject request
  const reviewRequest = async (status, id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + id,
        {},
        { withCredentials: true }
      );

      // remove from redux after review
      dispatch(removeRequest(id));
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-xl font-semibold">No Requests Found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-8">Connection Requests</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {requests.map((req) => {
        const requestId = req?._id;
        const sender = req?.fromUserId || req || {};
        const { firstName, lastName, photoURL, photoUrl, age, gender, about } = sender;
        const senderPhoto =
          photoURL ||
          photoUrl ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png";

        return (
          <div
            key={requestId || sender._id}
            className="card w-[430px] sm:w-[520px] bg-base-100 shadow-2xl mb-8 rounded-3xl"
          >
            <div className="card-body items-center text-center p-10">

              <img
                src={senderPhoto}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover"
              />

              <h2 className="text-2xl font-bold mt-4">
                {firstName} {lastName}
              </h2>

              <p className="text-base text-gray-600 mt-1">
                {age} , {gender}
              </p>

              <p className="text-base mt-3">{about}</p>

              <div className="card-actions justify-center mt-6 gap-3">
                <button
                  className="btn btn-success btn-md"
                  onClick={() => reviewRequest("accepted", requestId)}
                  disabled={!requestId}
                >
                  Accept
                </button>

                <button
                  className="btn btn-error btn-md"
                  onClick={() => reviewRequest("rejected", requestId)}
                  disabled={!requestId}
                >
                  Reject
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
