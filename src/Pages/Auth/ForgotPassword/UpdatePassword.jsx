import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Spinner from "../../../components/common/Spinner/Spinner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updatePassword } from "../../../../lib/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useState } from "react";
import Cookies from "js-cookie";
import * as Yup from "yup";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success("Password updated successfully");
      Cookies.remove("otpRequestedEmail");
      setTimeout(() => navigate("/login"), 100);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update password");
    },
  });

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = (values) => {
    const email = Cookies.get("otpRequestedEmail");
    if (!email) {
      toast.error("Email session expired. Please restart the process.");
      return;
    }
    mutation.mutate({ email, newPassword: values.password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-300 px-4"
      data-theme="synthwave"
    >
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Enter your new password below.
        </p>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="relative">
                <label className="label" htmlFor="password">
                  <span className="label-text">New Password</span>
                </label>
                <Field
                  className="input input-bordered w-full pr-10"
                  name="password"
                  type={showPassword ? "text" : "password"}
                />
                <span
                  className="absolute top-[58px] right-3 -translate-y-1/2 cursor-pointer text-lg text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
                <ErrorMessage
                  className="text-red-500 text-sm mt-1"
                  name="password"
                  component="div"
                />
              </div>

              <div className="relative">
                <label className="label" htmlFor="confirmPassword">
                  <span className="label-text">Confirm Password</span>
                </label>
                <Field
                  className="input input-bordered w-full pr-10"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                />
                <span
                  className="absolute top-[58px] right-3 -translate-y-1/2 cursor-pointer text-lg text-gray-500"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
                <ErrorMessage
                  className="text-red-500 text-sm mt-1"
                  name="confirmPassword"
                  component="div"
                />
              </div>

              <button
                className="btn btn-primary w-full text-base font-bold"
                disabled={isSubmitting || mutation.isPending}
                type="submit"
              >
                {isSubmitting || mutation.isPending ? (
                  <Spinner />
                ) : (
                  "Update Password"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdatePassword;
