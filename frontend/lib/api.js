import { axiosInstance } from "./utils";

export const signUp = async (values) => {
  const { data } = await axiosInstance.post("/auth/signup", values);
  return data;
};

export const getAuthUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};
