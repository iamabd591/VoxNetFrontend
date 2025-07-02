import PageLoader from "../components/common/PageLoader/PageLoader";
import Notification from "../Pages/Notification/Notification";
import Layout from "../components/common/Layout/Layout";
import { Navigate, Route, Routes } from "react-router";
import Onboarding from "../Pages/Auth/Onboarding";
import NotFound from "../Pages/NotFound/NotFound";
import useAuthHook from "../hooks/useAuthHook";
import Signup from "../Pages/Auth/Signup";
import Login from "../Pages/Auth/Login";
import Chat from "../Pages/Chat/Chat";
import Call from "../Pages/Call/Call";
import Home from "../Pages/Home/Home";

const Outlet = () => {
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
            <Layout>
              <Notification />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/chat"
        element={
          isAuthenticated && isOnBoarded ? (
            <Layout>
              <Chat />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/call"
        element={
          isAuthenticated && isOnBoarded ? (
            <Layout>
              <Call />
            </Layout>
          ) : (
            <Navigate to="/login" />
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
    </Routes>
  );
};

export default Outlet;
