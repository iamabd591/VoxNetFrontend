import { axiosInstance } from "./utils";

export const signUp = async (values) => {
  try {
    const { data } = await axiosInstance.post("/auth/signup", values);
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || "Sign up failed";
    throw new Error(message);
  }
};

export const login = async (values) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", values);
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || "Login failed";
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
  } catch (error) {
    const message = error?.response?.data?.message || "Logout failed";
    throw new Error(message);
  }
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || "Something went wrong";
    throw new Error(message);
  }
};

export const onBoarding = async (values) => {
  try {
    const res = await axiosInstance.post("/auth/onBoarding", values);
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || "Onboarding failed";
    throw new Error(message);
  }
};

export const getFriends = async () => {
  try {
    const res = await axiosInstance.get("/user/friends");
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || "Get friends failed";
    throw new Error(message);
  }
};

export const getRecomendeUsers = async () => {
  try {
    const res = await axiosInstance.get("/user/recomended");
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Get recomended users failed";
    throw new Error(message);
  }
};

export const friendRequest = async () => {
  try {
    const res = await axiosInstance.get("/user/outgoing-friend-requets");
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Get friend request failed";
    throw new Error(message);
  }
};

export const SendFriendRequest = async (userId) => {
  try {
    const res = await axiosInstance.post(`/user/friend-request/${userId}`);
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || "Friend request failed";
    throw new Error(message);
  }
};
