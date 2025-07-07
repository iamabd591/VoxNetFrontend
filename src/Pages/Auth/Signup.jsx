import SignUpForm from "../../components/SignUpForm/SignUpForm";
import frame from "../../../public/images/Video call.svg";
const Signup = () => {
  return (
    <div
      className="h-screen flex justify-center items-center p-4 sm:p-6 md:p-8"
      data-theme="synthwave"
    >
      <div
        className="border border-primary/25 flex flex-col lg:flex-row 
      w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden"
      >
        <SignUpForm />
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

export default Signup;
