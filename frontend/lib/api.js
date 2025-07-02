import { axiosInstance } from "./utils";

export const signUp = async (values) => {
  try {
    const { data } = await axiosInstance.post("/auth/signup", values);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const login = async (values) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", values);
    return data;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const logout = async () => {
  try {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const onBoarding = async (values) => {
  try {
    const res = await axiosInstance.post("/auth/onBoarding", values);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
