import { Link } from "react-router-dom";
import logo from "../assets/CodeConnectlogo.png";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../store/userSlice";
import { removeFeed } from "../store/feedSlice";
import { BASE_URL } from "../constants";


const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const userPhoto = user?.photoURL || user?.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );

      dispatch(removeUser());
      dispatch(removeFeed());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  return (
    <div className="navbar bg-base-100 shadow-md px-6 lg:px-10 min-h-[110px]">

      {/* Left */}
      <div className="flex-1">
        <Link to="/" className="inline-flex h-auto p-0 hover:bg-transparent focus:bg-transparent active:bg-transparent">
          <img
            src={logo}
            alt="CodeConnect Logo"
            className="h-20 sm:h-24 lg:h-28 w-auto object-contain drop-shadow-[0_0_12px_rgba(99,102,241,0.55)]"
          />
        </Link>
      </div>

      {/* Right: User Info */}
      {user && (
        <div className="flex items-center gap-3">

          {/* Welcome text */}
          <span className="hidden sm:block font-medium text-base-content">
            Welcome, <span className="font-semibold">{user.firstName}</span>
          </span>

          {/* Avatar Dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={userPhoto}
                  alt="User avatar"
                />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-40"
            >
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/connections">Connections</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>
                <button 
                onClick={handleLogout}
                className="text-error"
                >Logout</button>
              </li>
            </ul>
          </div>

        </div>
      )}
      

    </div>
  );
};

export default NavBar;
