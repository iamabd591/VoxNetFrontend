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

export const getFriendRequest = async () => {
  try {
    const res = await axiosInstance.get("user/get-friend-requets");
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Get friend request failed";
    throw new Error(message);
  }
};

export const acceptFriendRequest = async (requestId) => {
  try {
    const res = await axiosInstance.put(
      `/user/accept-friend-request/${requestId}`
    );
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Accept friend request failed";
    throw new Error(message);
  }
};

export const rejectFriendRequest = async (requestId) => {
  try {
    const res = await axiosInstance.delete(
      `/user/reject-friend-request/${requestId}`
    );
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Reject friend request failed";
    throw new Error(message);
  }
};

export const getStreamToken = async () => {
  try {
    const res = await axiosInstance.get("/chat/get-stream-token");
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Failed to get stream token";
    throw new Error(message);
  }
};

export const getOTP = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/get-otp", data);
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message || "Failed to send OTP";
    throw new Error(message);
  }
};

export const verifyOTP = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/verify-otp", data);
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.error || "Failed to verify otp";
    console.log(error);
    throw new Error(message);
  }
};

export const updatePassword = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/forgot-password", data);
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Failed to update password";
    throw new Error(message);
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await axiosInstance.post("/auth/update-profile", data);
    return res.data;
  } catch (error) {
    const message =
      error?.response?.data?.message || "Failed to update profile";
    throw new Error(message);
  }
};
