import PageLoader from "../components/common/PageLoader/PageLoader";
import VerifyOTP from "../Pages/Auth/ForgotPassword/VerifyOTP";
import Notification from "../Pages/Notification/Notification";
import SendOTP from "../Pages/Auth/ForgotPassword/SendOTP";
import Layout from "../components/common/Layout/Layout";
import { Navigate, Route, Routes } from "react-router";
import NotFound from "../Pages/NotFound/NotFound";
import Onboarding from "../Pages/Auth/Onboarding";
import useAuthHook from "../hooks/useAuthHook";
import Friends from "../Pages/Friends/Friends";
import CallPage from "../Pages/Call/CallPage";
import ChatPage from "../Pages/Chat/ChatPage";
import Signup from "../Pages/Auth/Signup";
import Login from "../Pages/Auth/Login";
import Home from "../Pages/Home/Home";
import Cookies from "js-cookie";

const Outlet = () => {
  const otpRequestedEmail = Cookies.get("otpRequestedEmail");
  const { isLoading, authUser } = useAuthHook();
  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnBoarded;

  if (isLoading)
    return (
      <div>
        <PageLoader />
      </div>
    );

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route
        path="/signup"
        element={
          !isAuthenticated ? (
            <Signup />
          ) : (
            <Navigate to={!isOnBoarded ? "/onboarding" : "/"} />
          )
        }
      />
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to={isOnBoarded ? "/" : "/onboarding"} />
          )
        }
      />
      <Route
        path="/onboarding"
        element={
          isAuthenticated && !isOnBoarded ? (
            <Onboarding />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/notification"
        element={
          isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <Notification />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }
      />
      <Route
        path="/friends"
        element={
          isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <Friends />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }
      />
      <Route
        path="/chat/:id"
        element={
          isAuthenticated && isOnBoarded ? (
            <Layout>
              <ChatPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }
      />
      <Route
        path="/call/:id"
        element={
          isAuthenticated && isOnBoarded ? (
            <Layout>
              <CallPage />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated && isOnBoarded ? (
            <Layout showSidebar={true}>
              <Home />
            </Layout>
          ) : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )
        }
      />
      <Route
        path="/send-otp"
        element={!isAuthenticated ? <SendOTP /> : <Navigate to="/" />}
      />

      <Route
        path="/verify-otp"
        element={
          !isAuthenticated && otpRequestedEmail ? (
            <VerifyOTP />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
};

export default Outlet;
