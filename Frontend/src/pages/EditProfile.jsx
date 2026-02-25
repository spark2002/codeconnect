import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../constants";
import { addUser } from "../store/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((store) => store.user);
  const profile = user || loggedInUser || {};

  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [photoURL, setPhotoURL] = useState(profile.photoURL || profile.photoUrl || "");
  const [age, setAge] = useState(profile.age || "");
  const [gender, setGender] = useState(profile.gender || "");
  const [about, setAbout] = useState(profile.about || "");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFirstName(profile.firstName || "");
    setLastName(profile.lastName || "");
    setPhotoURL(profile.photoURL || profile.photoUrl || "");
    setAge(profile.age || "");
    setGender(profile.gender || "");
    setAbout(profile.about || "");
  }, [profile]);

  const saveProfile = async () => {
    try {
      setError("");
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      };

      if (photoURL.trim()) payload.photoURL = photoURL.trim();
      if (age !== "") payload.age = Number(age);
      if (gender) payload.gender = gender;
      if (about.trim()) payload.about = about.trim();

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        payload,
        { withCredentials: true }
      );

      const updatedUser = res.data?.data;
      if (updatedUser && typeof updatedUser === "object") {
        dispatch(addUser(updatedUser));
      } else {
        dispatch(addUser({ ...(loggedInUser || {}), ...payload }));
      }

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to update profile"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] flex justify-center items-start pt-16 px-4">

      <div className="w-full max-w-3xl bg-[#1e293b] border border-gray-700 rounded-2xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Edit Profile
        </h2>

        {/* Profile Image Preview */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
            <img
              src={
                photoURL ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="text-gray-400 text-sm">First Name</label>
            <input
              className="w-full mt-1 p-3 rounded-lg bg-[#0f172a] border border-gray-600 text-white focus:border-blue-500 outline-none"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Last Name</label>
            <input
              className="w-full mt-1 p-3 rounded-lg bg-[#0f172a] border border-gray-600 text-white focus:border-blue-500 outline-none"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-400 text-sm">Photo URL</label>
            <input
              className="w-full mt-1 p-3 rounded-lg bg-[#0f172a] border border-gray-600 text-white focus:border-blue-500 outline-none"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Age</label>
            <input
              type="number"
              className="w-full mt-1 p-3 rounded-lg bg-[#0f172a] border border-gray-600 text-white focus:border-blue-500 outline-none"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm">Gender</label>
            <select
              className="w-full mt-1 p-3 rounded-lg bg-[#0f172a] border border-gray-600 text-white focus:border-blue-500 outline-none"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-400 text-sm">About</label>
            <textarea
              rows="4"
              className="w-full mt-1 p-3 rounded-lg bg-[#0f172a] border border-gray-600 text-white focus:border-blue-500 outline-none"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={saveProfile}
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg text-white font-medium shadow-lg"
          >
            Save Changes
          </button>
        </div>
        {error && (
          <p className="mt-4 text-sm text-red-400">{error}</p>
        )}

      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl animate-pulse">
          Profile Updated Successfully 🎉
        </div>
      )}

    </div>
  );
};

export default EditProfile;
