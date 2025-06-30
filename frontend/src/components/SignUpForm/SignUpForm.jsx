import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MdOutlineVoiceChat } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import Spinner from "../common/Spinner/Spinner";
import { signUp } from "../../../lib/api";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

const signUpSchema = Yup.object().shape({
  password: Yup.string().required("Required").min(8, "Must be 8 characters"),
  email: Yup.string().required("Required").email("Invalid email"),
  fullName: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
});

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Sign up successful");
      navigate("/onboarding");
    },
    onError: (error) => {
      toast.error("Signup failed");
      console.error("Signup failed", error);
    },
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      fullName: "",
      gender: "",
      email: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <div className="w-full lg:w-1/2 p-4 sm:p-8 flex-col">
      <div className="flex items-center justify-start gap-2">
        <MdOutlineVoiceChat className="size-9 text-primary" />
        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
          VoxNet
        </span>
      </div>

      <form onSubmit={formik.handleSubmit} className="w-full space-y-4 mt-6">
        <div>
          <h2 className="text-xl font-semibold">Create an Account</h2>
          <p className="text-sm opacity-70">Join VoxNet and start chat!</p>
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            className="input input-bordered w-full"
            placeholder="Enter your full name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="off"
            name="fullName"
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.fullName}
            </p>
          )}
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            className="input input-bordered w-full"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            autoComplete="off"
            name="email"
            type="email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
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

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Select Your Gender</span>
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                checked={formik.values.gender === "male"}
                className="radio radio-primary"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="gender"
                type="radio"
                value="male"
              />
              <span className="text-sm">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                checked={formik.values.gender === "female"}
                className="radio radio-primary"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value="female"
                name="gender"
                type="radio"
              />
              <span className="text-sm">Female</span>
            </label>
          </div>
          {formik.touched.gender && formik.errors.gender && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
          )}
        </div>

        <div className="form-control mt-3">
          <label className="label cursor-pointer justify-start gap-2">
            <input className="checkbox checkbox-sm" type="checkbox" required />
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
          {mutation.isPending ? <Spinner /> : "Create Account"}
        </button>

        <div className="mt-4">
          <p>
            Already have an account?
            <Link to="/login" className="text-primary hover:underline">
              {" "}
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
