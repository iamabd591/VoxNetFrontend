import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation } from "@tanstack/react-query";
import { verifyOTP } from "../../../../lib/api";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRef } from "react";
import * as Yup from "yup";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: verifyOTP,
    onSuccess: () => {
      toast.success("OTP sent successfully");
      setTimeout(() => navigate("/forgot-password"), 100);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify OTP");
      console.error("OTP sending failed", error);
    },
  });
  const inputsRef = useRef([]);
  const handleInput = (e, index, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 1);
    setFieldValue(`digit${index}`, value);
    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const validationSchema = Yup.object(
    Array.from({ length: 5 }).reduce((acc, _, i) => {
      acc[`digit${i}`] = Yup.string()
        .required("Required")
        .matches(/^\d$/, "Only digits");
      return acc;
    }, {})
  );

  const handleSubmit = (values) => {
    const otp = Object.values(values).join("");
    const email = Cookies.get("otpRequestedEmail");

    if (!email) {
      toast.error("Email session expired. Please request OTP again.");
      return;
    }

    mutation.mutate({ email, otp });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-200 px-4"
      data-theme="synthwave"
    >
      <div className="card w-full max-w-md bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Verify OTP</h2>
        <p className="text-center text-sm text-gray-400 mb-6">
          Enter the 5-digit code sent to your email.
        </p>

        <Formik
          initialValues={{
            digit0: "",
            digit1: "",
            digit2: "",
            digit3: "",
            digit4: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="flex justify-center gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Field
                      innerRef={(el) => (inputsRef.current[i] = el)}
                      name={`digit${i}`}
                      maxLength={1}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="input input-bordered w-12 h-12 text-center text-xl font-semibold"
                      onChange={(e) => handleInput(e, i, setFieldValue)}
                    />
                    <ErrorMessage
                      name={`digit${i}`}
                      component="div"
                      className="text-xs text-red-500"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                Verify
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default VerifyOTP;
