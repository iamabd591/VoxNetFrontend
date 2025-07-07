import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/common/Spinner/Spinner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { LANGUAGES } from "../../../lib/constant";
import useAuthHook from "../../hooks/useAuthHook";
import { updateProfile } from "../../../lib/api";
import toast from "react-hot-toast";
import * as Yup from "yup";

const Profile = () => {
  const { authUser, isLoading } = useAuthHook();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateProfile,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  const initialValues = {
    fullName: authUser.fullName || "",
    bio: authUser.bio || "",
    location: authUser.location || "",
    age: authUser.age || "",
    language: authUser.language || "",
    gender: authUser.gender || "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Required"),
    location: Yup.string().required("Required"),
    language: Yup.string().required("Required"),
    bio: Yup.string().required("Required"),
    gender: Yup.string()
      .oneOf(["male", "female"], "Select gender")
      .required("Required"),
    age: Yup.number()
      .min(18, "Minimum age is 18")
      .max(98, "Maximum age is 98")
      .required("Required"),
  });

  const handleSubmit = (values, actions) => {
    mutation.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries(["auth"]);
        toast.success("Profile updated successfully");
        actions.setSubmitting(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
        actions.setSubmitting(false);
        console.error("Failed to update profile", error.message);
      },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-base-300 px-4 py-10"
      data-theme="synthwave"
    >
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl p-6">
        <div className="flex flex-col items-center mb-6">
          <img
            src={authUser.profileUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-primary object-cover"
          />
          <p className="mt-2 text-sm text-white font-semibold">
            {authUser.email}
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) =>
            isSubmitting ? (
              <Spinner />
            ) : (
              <Form className="space-y-4">
                {["fullName", "bio", "location", "age"].map((field) => (
                  <div key={field}>
                    <label className="label capitalize" htmlFor={field}>
                      <span className="label-text">
                        {field.replace(/([A-Z])/g, " $1")}
                      </span>
                    </label>
                    <Field
                      name={field}
                      type={field === "age" ? "number" : "text"}
                      className="input input-bordered w-full"
                    />
                    <ErrorMessage
                      name={field}
                      component="div"
                      className="text-sm text-red-500 mt-1"
                    />
                  </div>
                ))}

                <div>
                  <label className="label" htmlFor="gender">
                    <span className="label-text">Gender</span>
                  </label>

                  <Field
                    as="select"
                    name="language"
                    className="select select-bordered w-full"
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES?.map((lang) => (
                      <option value={lang.toLowerCase()} key={`native-${lang}`}>
                        {lang}
                      </option>
                    ))}
                  </Field>
                </div>

                <ErrorMessage
                  name="language"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />

                <div>
                  <label className="label" htmlFor="gender">
                    <span className="label-text">Gender</span>
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className="select select-bordered w-full"
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <button
                  className="btn btn-primary w-full text-base font-bold"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? <Spinner /> : "Update Profile"}
                </button>
              </Form>
            )
          }
        </Formik>
      </div>
    </div>
  );
};

export default Profile;
