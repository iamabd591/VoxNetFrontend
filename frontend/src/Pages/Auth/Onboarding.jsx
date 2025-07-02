import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/common/Spinner/Spinner";
import { LANGUAGES } from "../../../lib/constant";
import useAuthHook from "../../hooks/useAuthHook";
import { PiMapPinFill } from "react-icons/pi";
import { onBoarding } from "../../../lib/api";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const onBoardingSchema = Yup.object().shape({
  location: Yup.string().required("Required"),
  language: Yup.string().required("Required"),
  bio: Yup.string().required("Required"),
  age: Yup.number()
    .min(18, "Min value is 18")
    .max(98, "Max value is 98")
    .required("Required"),
});

const Onboarding = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthHook();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: onBoarding,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("You are on-boarded successful");
      setTimeout(() => navigate("/"), 100);
    },
    onError: (error) => {
      toast.error(error.message || "OnBoarding failed");
      console.error("OnBoarding failed", error);
    },
  });
  const formik = useFormik({
    initialValues: {
      language: "",
      location: "",
      bio: "",
      age: "",
    },
    validationSchema: onBoardingSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <div
      className="min-h-screen bg-base-100 flex items-center justify-center p-4"
      data-theme="synthwave"
    >
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                <img
                  src={authUser?.profileUrl}
                  alt="User-profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                className="input input-bordered w-full"
                value={authUser?.fullName}
                name="fullName"
                type="text"
                readOnly
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your Age</span>
              </label>
              <input
                className="input input-bordered w-full appearance-none"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.age}
                placeholder="Your age"
                type="number"
                name="age"
                min={18}
                max={98}
              />
              {formik.touched.age && formik.errors.age && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.age}</p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bio}
                name="bio"
              />
              {formik.touched.bio && formik.errors.bio && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.bio}</p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Your native Language</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={formik.values.language}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="language"
              >
                <option value="">Select your native language</option>
                {LANGUAGES?.map((lang) => (
                  <option value={lang.toLowerCase()} key={`native-${lang}`}>
                    {lang}
                  </option>
                ))}
              </select>
              {formik.touched.language && formik.errors.language && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.language}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Your location</span>
              </label>
              <div className="relative">
                <PiMapPinFill className="absolute top-[26px] transform -translate-y-1/2 left-5 size-4 text-base-content opacity-70" />
                <input
                  className="input input-bordered w-full pl-10"
                  onChange={formik.handleChange}
                  value={formik.values.location}
                  onBlur={formik.handleBlur}
                  placeholder="City, Country"
                  name="location"
                  type="text"
                />
                {formik.touched.location && formik.errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.location}
                  </p>
                )}
              </div>
            </div>

            <button
              className="btn btn-primary w-full font-bold text-sm"
              disabled={mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? <Spinner /> : "Complete Your Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
