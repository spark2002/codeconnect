import NavBar from "./components/NavBar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "./constants";
import { addUser } from "./store/userSlice";
import { useEffect } from "react";


const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);
  const isAuthPage = location.pathname === "/login";

  const fetchUser = async () => {
    if (userData) return;

    try {
      const res = await axios.get(
        BASE_URL + "/profile/view",
        { withCredentials: true }
      );
      dispatch(addUser(res.data?.data ?? res.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/login");
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUser();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className={isAuthPage ? "h-full flex items-center justify-center" : "max-w-7xl mx-auto"}>
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Body;
