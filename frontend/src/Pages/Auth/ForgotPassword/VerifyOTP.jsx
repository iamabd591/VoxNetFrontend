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

  const handleSubmit = (values, { setSubmitting }) => {
    const otp = Object.values(values).join("");
    const email = Cookies.get("otpRequestedEmail");

    if (!email) {
      toast.error("Email session expired. Please request OTP again.");
      setSubmitting(false);
      return;
    }

    mutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          toast.success("OTP verified successfully");
          setSubmitting(false);
          navigate("/update-password");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to verify OTP");
          console.error("OTP verification failed", error.message);
          setSubmitting(false);
        },
      }
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-300 px-4"
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
          {({ setFieldValue, isSubmitting, values, errors, touched }) => {
            // const allFilled = Object.values(values).every(
            //   (v) => v.trim() !== ""
            // );

            const showError =
              Object.keys(errors).length > 0 && Object.keys(touched).length > 0;

            return (
              <Form className="space-y-6">
                <div className="flex justify-center gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el)}
                      className="input input-bordered w-12 h-12 text-center text-xl font-semibold"
                      onChange={(e) => handleInput(e, i, setFieldValue)}
                      autoComplete="one-time-code"
                      value={values[`digit${i}`]}
                      inputMode="numeric"
                      name={`digit${i}`}
                      maxLength={1}
                    />
                  ))}
                </div>

                {showError && (
                  <div className="text-center text-sm text-red-500">
                    All fields are required and must be digits.
                  </div>
                )}

                <button
                  className="btn btn-primary w-full font-bold text-base"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Verify
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default VerifyOTP;
