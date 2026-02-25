import { Route, Routes } from "react-router-dom";
import Body from "./Body";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import EditProfile from "./pages/EditProfile";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />}>
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route index element={<Feed />} />
        <Route path="connections" element={<Connections />} />
        <Route path="requests" element={<Requests />} />
        <Route path="edit-profile" element={<EditProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
