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
