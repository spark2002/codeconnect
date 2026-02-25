import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../constants";

const UserCard = ({ user, onAccept, onRequestSent }) => {
  const [loadingAction, setLoadingAction] = useState(false);
  const {
    _id,
    id,
    firstName,
    lastName,
    photoURL,
    photoUrl,
    age,
    gender,
    about,
  } = user || {};
  const userId = _id || id;
  const profilePhoto =
    photoURL ||
    photoUrl ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleSendRequest = async (status, id) => {
    if (!id || loadingAction) return;
    try {
      setLoadingAction(true);
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + id,
        {},
        { withCredentials: true }
      );
      if (onRequestSent) {
        onRequestSent(id, status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="w-[420px] sm:w-[500px] bg-base-200 rounded-3xl shadow-2xl p-10 text-center transition-all duration-300 hover:scale-105">
      <div className="card-body items-center text-center">
        <img src={profilePhoto} alt="user" className="w-32 h-32 rounded-full object-cover" />
        <h2 className="text-2xl font-bold mt-3">
          {firstName} {lastName}
        </h2>
        <p className="text-base text-gray-600 mt-1">
          {age}, {gender}
        </p>
        <p className="text-base mt-3">{about}</p>

        {onAccept && (
          <div className="card-actions justify-center mt-6 gap-3">
            <button
              className="btn btn-md"
              onClick={() => handleSendRequest("ignored", userId)}
              disabled={loadingAction}
            >
              Ignore
            </button>
            <button
              className="btn btn-primary btn-md"
              onClick={() => handleSendRequest("interested", userId)}
              disabled={loadingAction}
            >
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
