import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../constants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../store/userSlice";
import { removeFeed } from "../store/feedSlice";

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailid, setEmailid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const normalizeUser = (payload) => payload?.data ?? payload;
  const switchAuthMode = () => {
    setIsLoginForm((prev) => !prev);
    setError("");
    setEmailid("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  // LOGIN
  const handleLogin = async () => {
    try {
      setError("");
      const res = await axios.post(
        BASE_URL + "/login",
        { emailid, password },
        { withCredentials: true }
      );

      dispatch(removeFeed());
      dispatch(addUser(normalizeUser(res.data)));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  // SIGNUP
  const handleSignup = async () => {
    try {
      setError("");
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailid, password },
        { withCredentials: true }
      );

      dispatch(removeFeed());
      dispatch(addUser(normalizeUser(res.data)));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-6xl rounded-3xl overflow-hidden border border-base-300 bg-base-100/90 shadow-2xl">
      <div className="grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-info">CodeConnect</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Build meaningful
              <br />
              developer connections.
            </h1>
          </div>
          <p className="text-sm text-base-content/70">
            Discover people, manage requests, and keep your network active in one place.
          </p>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <h2 className="text-3xl font-bold mb-2">{isLoginForm ? "Welcome back" : "Create account"}</h2>
          <p className="text-base-content/70 mb-8">
            {isLoginForm ? "Login to continue to your feed." : "Sign up and start connecting."}
          </p>

          {!isLoginForm && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="form-control mb-2">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="form-control mb-2">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email ID</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              value={emailid}
              onChange={(e) => setEmailid(e.target.value)}
              autoComplete={isLoginForm ? "email" : "off"}
              required
            />
          </div>

          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-16"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLoginForm ? "current-password" : "new-password"}
                required
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm absolute right-1 top-1/2 -translate-y-1/2 px-3"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className="text-error text-sm mt-3">{error}</p>}

          <div className="form-control mt-6">
            <button
              className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignup}
            >
              {isLoginForm ? "Login" : "Signup"}
            </button>
          </div>

          <p
            className="mt-6 cursor-pointer text-sm text-info hover:underline"
            onClick={switchAuthMode}
          >
            {isLoginForm ? "New User? Signup Here" : "Existing User? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
