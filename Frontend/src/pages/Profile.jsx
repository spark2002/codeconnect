// pages/Profile.jsx

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants";
import { addUser } from "../store/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const storedUser = useSelector((store) => store.user);
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(!storedUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        const profileData = res.data?.data ?? res.data;
        setUser(profileData);
        dispatch(addUser(profileData));
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>Unable to load profile.</div>;

  const {
    firstName,
    lastName,
    emailid,
    emailId,
    photoURL,
    photoUrl,
    age,
    gender,
    about,
  } = user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex justify-center items-start pt-16 px-4">

      <div className="w-full max-w-3xl bg-[#1e293b] rounded-2xl shadow-2xl p-8 border border-gray-700">

        {/* Profile Header */}
        <div className="flex items-center gap-6">

          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
            <img
              src={
                photoURL ||
                photoUrl ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">
              {firstName} {lastName}
            </h2>
            <p className="text-gray-400 mt-1">{emailid || emailId}</p>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Info Section */}
        <div className="grid grid-cols-2 gap-6 text-gray-300">

          <div>
            <p className="text-gray-500 text-sm">Age</p>
            <p className="text-lg font-semibold">
              {age || "Not Added"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Gender</p>
            <p className="text-lg font-semibold">
              {gender || "Not Added"}
            </p>
          </div>

        </div>

        {/* About Section */}
        <div className="mt-8">
          <p className="text-gray-500 text-sm mb-2">About</p>
          <p className="text-gray-300 leading-relaxed">
            {about || "No description added yet."}
          </p>
        </div>


        {/* Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg text-white font-medium shadow-lg"
          >
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
