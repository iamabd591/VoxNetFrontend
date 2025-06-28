import Notification from "../Pages/Notification/Notification";
import { Navigate, Route, Routes } from "react-router";
import NotFound from "../Pages/NotFound/NotFound";
import Onboarding from "../Pages/Auth/Onboarding";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/utils";
import Signup from "../Pages/Auth/Signup";
import Login from "../Pages/Auth/Login";
import Chat from "../Pages/Chat/Chat";
import Call from "../Pages/Call/Call";
import Home from "../Pages/Home/Home";

const Outlet = () => {
  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  const authUser = authData?.user;
  console.log("Data:", authUser);

  if (isLoading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
      <Route
        path="/notification"
        element={authUser ? <Notification /> : <Navigate to="/login" />}
      />
      <Route
        path="/onboarding"
        element={authUser ? <Onboarding /> : <Navigate to="/login" />}
      />
      <Route
        path="/signup"
        element={authUser ? <Signup /> : <Navigate to="/login" />}
      />
      <Route
        path="/chat"
        element={authUser ? <Chat /> : <Navigate to="/login" />}
      />
      <Route
        path="/call"
        element={authUser ? <Call /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={authUser ? <Home /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default Outlet;
