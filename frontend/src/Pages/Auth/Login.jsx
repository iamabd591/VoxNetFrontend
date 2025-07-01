import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Spinner from "../../components/common/Spinner/Spinner";
import frame from "../../../public/images/Video call.svg";
import { MdOutlineVoiceChat } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { login } from "../../../lib/api";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  password: Yup.string().required("Required").min(8, "Minimum 8 character"),
  email: Yup.string().email("Incorrect email").required("Required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Login successfully");
      setTimeout(() => navigate("/"), 100);
    },
    onError: (error) => {
      toast.error("Login failed");
      console.error("Login failed", error);
    },
  });
  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(values);
    },
  });
  return (
    <div
      className="h-screen flex justify-center items-center p-4 sm:p-6 md:p-8"
      data-theme="synthwave"
    >
      <div
        className="border  border-primary/25 flex flex-col lg:flex-row 
      w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex-col">
          <div className="flex items-center justify-start gap-2">
            <MdOutlineVoiceChat className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
              VoxNet
            </span>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="w-full space-y-4 mt-6"
          >
            <div>
              <h2 className="text-xl font-semibold">Create an Account</h2>
              <p className="text-sm opacity-70">Join VoxNet and start chat!</p>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                className="input input-bordered w-full"
                placeholder="Enter your email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
                autoComplete="off"
                name="email"
                type="email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pr-10"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                name="password"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              )}
              <div className="absolute right-3 top-[52px] cursor-pointer text-xl text-gray-500">
                {showPassword ? (
                  <AiFillEyeInvisible onClick={() => setShowPassword(false)} />
                ) : (
                  <AiFillEye onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>

            <div className="form-control mt-3">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  className="checkbox checkbox-sm"
                  type="checkbox"
                  required
                />
                <span className="text-xs leading-tight">
                  I agree to the{" "}
                  <span className="text-primary hover:underline">
                    terms of service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary hover:underline">
                    privacy policy
                  </span>
                </span>
              </label>
            </div>

            <button
              className="btn btn-primary w-full font-bold"
              disabled={mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? <Spinner /> : "Login"}
            </button>

            <div className="mt-4">
              <p>
                Don't have an account?
                <Link to="/signup" className="text-primary hover:underline">
                  {" "}
                  Sign Up 
                </Link>
                  {" "}
                now
              </p>
            </div>
          </form>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                alt="Language connection illustration"
                className="w-full h-full"
                src={frame}
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with friends worldwide
              </h2>
              <p className="opacity-70">
                Start conversations, make new friends, and enjoy seamless video
                calls — all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
