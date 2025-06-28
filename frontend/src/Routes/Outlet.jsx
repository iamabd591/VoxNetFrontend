import Notification from "../Pages/Notification/Notification";
import NotFound from "../Pages/NotFound/NotFound";
import Onboarding from "../Pages/Auth/Onboarding";
import { Route, Routes } from "react-router";
import Signup from "../Pages/Auth/Signup";
import Login from "../Pages/Auth/Login";
import Chat from "../Pages/Chat/Chat";
import Call from "../Pages/Call/Call";
import Home from "../Pages/Home/Home";

const Outlet = () => {
  return (
    <Routes>
      <Route path="/notification" element={<Notification />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/call" element={<Call />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default Outlet;
