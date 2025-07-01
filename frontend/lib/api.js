import { axiosInstance } from "./utils";

export const signUp = async (values) => {
  const { data } = await axiosInstance.post("/auth/signup", values);
  return data;
};

export const login = async (values) => {
  const { data } = await axiosInstance.post("/auth/login", values);
  return data;
};

export const getAuthUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

export const onBoarding = async (values) => {
  const res = await axiosInstance.post("/auth/onBoarding", values);
  return res.data;
};
