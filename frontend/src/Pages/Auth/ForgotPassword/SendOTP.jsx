import Spinner from "../../../components/common/Spinner/Spinner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation } from "@tanstack/react-query";
import { getOTP } from "../../../../lib/api";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import * as Yup from "yup";

const SendOTP = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: getOTP,
    onSuccess: () => {
      toast.success("OTP sent successfully");
      setTimeout(() => navigate("/verify-otp"), 100);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send OTP");
      console.error("OTP sending failed", error);
    },
  });

  const handleSendOTP = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    Cookies.set("otpRequestedEmail", values.email, { expires: 1 / 144 });
    mutation.mutate(values);
    resetForm();
    setSubmitting(false);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-200"
      data-theme="synthwave"
    >
      <div className="card w-full max-w-lg bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Send OTP</h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Enter your email to receive a verification code.
        </p>

        <Formik
          validationSchema={validationSchema}
          initialValues={{ email: "" }}
          onSubmit={handleSendOTP}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="form-control">
                <label htmlFor="email" className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <Field
                  className="input input-bordered w-full"
                  placeholder="example@email.com"
                  name="email"
                  type="email"
                />
                <ErrorMessage
                  className="text-red-500 text-sm mt-1"
                  component="div"
                  name="email"
                />
              </div>

              <button
                disabled={isSubmitting || mutation.isPending}
                className="btn btn-primary w-full"
                type="submit"
              >
                {isSubmitting || mutation.isPending ? <Spinner /> : "Send OTP"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SendOTP;
