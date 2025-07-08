import Spinner from "../../components/common/Spinner/Spinner";
import frame from "../../../public/images/not-found.svg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center" data-theme="synthwave">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-center p-4 sm:p-6"
      data-theme="synthwave"
    >
      <img
        src={frame}
        alt="Not Found"
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl object-contain"
      />

      <Link
        to="/"
        className="btn btn-primary text-sm sm:text-base font-semibold"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
